const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    consumer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, default: "", trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, consumer: 1 }, { unique: true });

module.exports = mongoose.model("Review", ReviewSchema);

