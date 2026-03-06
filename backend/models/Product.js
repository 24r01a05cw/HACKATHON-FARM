const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  name: { type: String, required: true, trim: true, index: true },
  category: {
    type: String,
    enum: ["Vegetables", "Fruits", "Cereals", "Millets", "Pulses", "Oil Seeds", "Natural Products"],
    required: true,
    index: true,
  },
  imageUrls: { type: [String], default: [] },
  harvestDate: { type: Date },
  isOrganic: { type: Boolean, default: false },
  badges: { type: [String], default: [] }, // e.g. ["Fresh harvest"]

  pricePerKg: { type: Number, required: true, min: 0 },
  availableQuantityKg: { type: Number, required: true, min: 0 },
  isSoldOut: { type: Boolean, default: false, index: true },
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);