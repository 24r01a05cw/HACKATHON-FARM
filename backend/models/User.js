const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true, index: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ["farmer", "consumer"], required: true, index: true },

  profilePhotoUrl: { type: String, default: "" },

  location: {
    village: { type: String, default: "" },
    district: { type: String, default: "" },
    state: { type: String, default: "" },
    cityOrVillage: { type: String, default: "" }, // for customers
  },

  farmerProfile: {
    farmSize: { type: String, default: "" },
    primaryCrops: { type: [String], default: [] },
  },

  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantityKg: { type: Number, required: true, min: 0.1 },
    },
  ],

  settings: {
    language: {
      type: String,
      enum: ["en", "te", "hi", "ta", "kn"],
      default: "en",
    },
    notificationsEnabled: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: false },
  },
}, { timestamps: true });

UserSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("User", UserSchema);