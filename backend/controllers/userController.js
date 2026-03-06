const User = require("../models/User");
const Follow = require("../models/Follow");
const Product = require("../models/Product");
const Post = require("../models/Post");
const Review = require("../models/Review");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.role !== "farmer") {
      return res.json({ success: true, data: { user: user.toJSON() } });
    }

    const [followers, products, posts, reviews] = await Promise.all([
      Follow.countDocuments({ farmer_id: user._id }),
      Product.countDocuments({ farmer: user._id }),
      Post.countDocuments({ farmer: user._id }),
      Review.find({ farmer: user._id }).select("rating"),
    ]);

    const ratingAvg =
      reviews.length === 0
        ? 0
        : reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length;

    return res.json({
      success: true,
      data: {
        user: user.toJSON(),
        stats: {
          followers,
          products,
          posts,
          rating: Number(ratingAvg.toFixed(2)),
          ratingCount: reviews.length,
        },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateMySettings = async (req, res) => {
  try {
    const { language, notificationsEnabled, darkMode } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (language !== undefined) user.settings.language = language;
    if (notificationsEnabled !== undefined) user.settings.notificationsEnabled = Boolean(notificationsEnabled);
    if (darkMode !== undefined) user.settings.darkMode = Boolean(darkMode);

    await user.save();
    return res.json({ success: true, data: user.toJSON() });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

