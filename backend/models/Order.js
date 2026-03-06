const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  consumer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  farmer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true },
      pricePerKg: { type: Number, required: true, min: 0 },
      quantityKg: { type: Number, required: true, min: 0.1 },
      lineTotal: { type: Number, required: true, min: 0 },
    },
  ],
  totalAmount: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"],
    default: "pending",
    index: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);