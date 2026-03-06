const mongoose = require("mongoose");

const FollowSchema = new mongoose.Schema({
  consumer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  farmer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

FollowSchema.index({ consumer_id: 1, farmer_id: 1 }, { unique: true });

module.exports = mongoose.model("Follow", FollowSchema);