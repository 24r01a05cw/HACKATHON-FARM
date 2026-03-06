const Follow = require("../models/Follow");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Post = require("../models/Post");
const Review = require("../models/Review");
const mongoose = require("mongoose");

exports.getDashboard = async (req, res) => {
  try {
    const farmerId = req.user.id;

    const [ordersCount, productsCount, followersCount, postsCount, reviews] = await Promise.all([
      Order.countDocuments({ farmer_id: farmerId }),
      Product.countDocuments({ farmer: farmerId }),
      Follow.countDocuments({ farmer_id: farmerId }),
      Post.countDocuments({ farmer: farmerId }),
      Review.find({ farmer: farmerId }).select("rating"),
    ]);

    const ratingAvg =
      reviews.length === 0
        ? 0
        : reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length;

    const salesAgg = await Order.aggregate([
      { $match: { farmer_id: new mongoose.Types.ObjectId(farmerId), status: { $ne: "cancelled" } } },
      { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
    ]);
    const totalSales = salesAgg?.[0]?.totalSales || 0;

    return res.json({
      success: true,
      data: {
        totalSales,
        totalOrders: ordersCount,
        productsListed: productsCount,
        farmerRating: Number(ratingAvg.toFixed(2)),
        followers: followersCount,
        posts: postsCount,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const followers = await Follow.find({ farmer_id: req.user.id })
      .populate("consumer_id", "fullName profilePhotoUrl location")
      .sort({ createdAt: -1 });
    return res.json({ success: true, data: followers });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ farmer_id: req.user.id })
      .populate("consumer_id", "fullName profilePhotoUrl location")
      .populate("items.product")
      .sort({ createdAt: -1 });
    return res.json({ success: true, data: orders });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: "status required" });
    const order = await Order.findOne({ _id: req.params.id, farmer_id: req.user.id });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    order.status = status;
    await order.save();
    return res.json({ success: true, data: order });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

