const Product = require("../models/Product");
const Follow = require("../models/Follow");
const Order = require("../models/Order");
const User = require("../models/User");

exports.getProducts = async (req, res) => {
  try {
    const { q, category, farmerId } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (farmerId) filter.farmer = farmerId;
    if (q) filter.name = { $regex: String(q), $options: "i" };

    const products = await Product.find(filter)
      .populate("farmer", "fullName profilePhotoUrl location")
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: products });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.followFarmer = async (req, res) => {
  try {
    const farmerId = req.params.farmerId || req.body.farmer_id || req.body.farmerId;
    if (!farmerId) return res.status(400).json({ success: false, message: "farmerId required" });

    const follow = await Follow.create({
      consumer_id: req.user.id,
      farmer_id: farmerId,
    });

    return res.json({ success: true, data: follow });
  } catch (err) {
    if (err.code === 11000) {
      return res.json({ success: true, message: "Already following" });
    }
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.unfollowFarmer = async (req, res) => {
  try {
    const farmerId = req.params.farmerId;
    await Follow.findOneAndDelete({ consumer_id: req.user.id, farmer_id: farmerId });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const following = await Follow.find({ consumer_id: req.user.id }).populate(
      "farmer_id",
      "fullName profilePhotoUrl location"
    );
    return res.json({ success: true, data: following });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "wishlist",
      populate: { path: "farmer", select: "fullName profilePhotoUrl location" },
    });
    return res.json({ success: true, data: user?.wishlist || [] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { wishlist: productId } });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    await User.findByIdAndUpdate(req.user.id, { $pull: { wishlist: productId } });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "cart.product",
      populate: { path: "farmer", select: "fullName profilePhotoUrl location" },
    });
    return res.json({ success: true, data: user?.cart || [] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.addCartItem = async (req, res) => {
  try {
    const { productId, quantityKg } = req.body;
    if (!productId || !quantityKg) {
      return res.status(400).json({ success: false, message: "productId and quantityKg required" });
    }

    const user = await User.findById(req.user.id);
    const idx = (user.cart || []).findIndex((i) => String(i.product) === String(productId));
    if (idx >= 0) user.cart[idx].quantityKg = Number(quantityKg);
    else user.cart.push({ product: productId, quantityKg: Number(quantityKg) });
    await user.save();
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    await User.findByIdAndUpdate(req.user.id, { $pull: { cart: { product: productId } } });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

async function createOrdersFromItems(consumerId, items) {
  // items: [{ productId, quantityKg }]
  const products = await Product.find({ _id: { $in: items.map((i) => i.productId) } }).populate(
    "farmer",
    "_id"
  );
  const byId = new Map(products.map((p) => [String(p._id), p]));

  // Group by farmer
  const groups = new Map(); // farmerId -> [{product, qty}]
  for (const item of items) {
    const p = byId.get(String(item.productId));
    if (!p) throw new Error("Product not found in checkout");
    if (p.isSoldOut || p.availableQuantityKg <= 0) throw new Error(`Product sold out: ${p.name}`);
    if (Number(item.quantityKg) > p.availableQuantityKg) {
      throw new Error(`Insufficient stock for ${p.name}`);
    }
    const farmerId = String(p.farmer?._id || p.farmer);
    if (!groups.has(farmerId)) groups.set(farmerId, []);
    groups.get(farmerId).push({ product: p, quantityKg: Number(item.quantityKg) });
  }

  const createdOrders = [];
  for (const [farmerId, lines] of groups.entries()) {
    let totalAmount = 0;
    const orderItems = lines.map(({ product, quantityKg }) => {
      const lineTotal = Number(product.pricePerKg) * Number(quantityKg);
      totalAmount += lineTotal;
      return {
        product: product._id,
        name: product.name,
        pricePerKg: Number(product.pricePerKg),
        quantityKg: Number(quantityKg),
        lineTotal,
      };
    });

    const order = await Order.create({
      consumer_id: consumerId,
      farmer_id: farmerId,
      items: orderItems,
      totalAmount,
      status: "pending",
    });

    // Decrement stock
    for (const { product, quantityKg } of lines) {
      product.availableQuantityKg = Number(product.availableQuantityKg) - Number(quantityKg);
      product.isSoldOut = product.availableQuantityKg <= 0;
      await product.save();
    }

    createdOrders.push(order);
  }

  return createdOrders;
}

exports.checkout = async (req, res) => {
  try {
    const { items } = req.body; // optional: [{productId, quantityKg}]
    let checkoutItems = items;
    if (!Array.isArray(checkoutItems) || checkoutItems.length === 0) {
      const user = await User.findById(req.user.id);
      checkoutItems = (user.cart || []).map((i) => ({ productId: i.product, quantityKg: i.quantityKg }));
      if (checkoutItems.length === 0) {
        return res.status(400).json({ success: false, message: "Cart is empty" });
      }
    }

    const orders = await createOrdersFromItems(req.user.id, checkoutItems);
    // clear cart after checkout
    await User.findByIdAndUpdate(req.user.id, { $set: { cart: [] } });

    return res.json({ success: true, data: orders });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ consumer_id: req.user.id })
      .populate("farmer_id", "fullName profilePhotoUrl location")
      .populate("items.product")
      .sort({ createdAt: -1 });
    return res.json({ success: true, data: orders });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Back-compat single-product order endpoint
exports.orderProduct = async (req, res) => {
  try {
    const productId = req.body.product_id || req.body.productId;
    const quantityKg = req.body.quantityKg ?? req.body.quantity;
    if (!productId || !quantityKg) {
      return res.status(400).json({ success: false, message: "product_id and quantity required" });
    }
    const orders = await createOrdersFromItems(req.user.id, [{ productId, quantityKg }]);
    return res.json({ success: true, data: orders[0] });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};