const Review = require("../models/Review");
const Product = require("../models/Product");

exports.addReview = async (req, res) => {
  try {
    const { rating, text } = req.body;
    const productId = req.params.id;
    if (!rating) return res.status(400).json({ success: false, message: "rating required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const review = await Review.create({
      product: productId,
      farmer: product.farmer,
      consumer: req.user.id,
      rating: Number(rating),
      text: text || "",
    });

    return res.json({ success: true, data: review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "Already reviewed" });
    }
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.listReviews = async (req, res) => {
  try {
    const productId = req.params.id;
    const reviews = await Review.find({ product: productId })
      .populate("consumer", "fullName profilePhotoUrl")
      .sort({ createdAt: -1 });

    const avg =
      reviews.length === 0
        ? 0
        : reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length;

    return res.json({
      success: true,
      data: reviews,
      summary: { averageRating: Number(avg.toFixed(2)), count: reviews.length },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

