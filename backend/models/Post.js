const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

const PostSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    mediaType: { type: String, enum: ["image", "video"], required: true },
    mediaUrl: { type: String, required: true, trim: true },

    cropType: { type: String, required: true, trim: true, index: true },
    daysAfterPlanting: { type: Number, required: true, min: 0 },
    description: { type: String, default: "", trim: true, maxlength: 1000 },
    problem: { type: String, default: "", trim: true, maxlength: 300 },

    isImportant: { type: Boolean, default: false, index: true },
    importantType: {
      type: String,
      enum: ["market_price", "disease_alert", "weather_warning", "price_hike", "other"],
    },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    saves: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: { type: [CommentSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);

