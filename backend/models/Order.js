const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  consumer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  quantity: Number,
  status: {
    type: String,
    default: "pending"
  }
});

module.exports = mongoose.model("Order", OrderSchema);