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
});

module.exports = mongoose.model("Follow", FollowSchema);