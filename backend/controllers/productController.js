const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      pricePerKg,
      availableQuantityKg,
      imageUrls,
      harvestDate,
      isOrganic,
      badges,
    } = req.body;

    if (!name || !category || pricePerKg == null || availableQuantityKg == null) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const product = await Product.create({
      farmer: req.user.id,
      name,
      category,
      pricePerKg: Number(pricePerKg),
      availableQuantityKg: Number(availableQuantityKg),
      imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
      harvestDate: harvestDate ? new Date(harvestDate) : undefined,
      isOrganic: Boolean(isOrganic),
      badges: Array.isArray(badges) ? badges : [],
      isSoldOut: Number(availableQuantityKg) <= 0,
    });

    return res.json({ success: true, data: product });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user.id }).sort({ createdAt: -1 });
    return res.json({ success: true, data: products });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateMyProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id, farmer: req.user.id });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const allowed = [
      "name",
      "category",
      "pricePerKg",
      "availableQuantityKg",
      "imageUrls",
      "harvestDate",
      "isOrganic",
      "badges",
      "isSoldOut",
    ];

    for (const key of allowed) {
      if (req.body[key] !== undefined) product[key] = req.body[key];
    }

    if (req.body.pricePerKg !== undefined) product.pricePerKg = Number(req.body.pricePerKg);
    if (req.body.availableQuantityKg !== undefined) {
      product.availableQuantityKg = Number(req.body.availableQuantityKg);
      product.isSoldOut = product.availableQuantityKg <= 0;
    }
    if (req.body.harvestDate !== undefined) {
      product.harvestDate = req.body.harvestDate ? new Date(req.body.harvestDate) : undefined;
    }

    await product.save();
    return res.json({ success: true, data: product });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteMyProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findOneAndDelete({ _id: id, farmer: req.user.id });
    if (!deleted) return res.status(404).json({ success: false, message: "Product not found" });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.listProducts = async (req, res) => {
  try {
    const { q, category, farmerId } = req.query;
    const filter = { isSoldOut: { $in: [false, true] } };

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

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "farmer",
      "fullName profilePhotoUrl location"
    );
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    return res.json({ success: true, data: product });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};