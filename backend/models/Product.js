const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  farmer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  product_name: String,
  price: Number,
  quantity: Number
});

module.exports = mongoose.model("Product", ProductSchema);