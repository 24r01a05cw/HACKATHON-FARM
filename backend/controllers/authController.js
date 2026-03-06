const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function normalizePhone(phone) {
  return String(phone || "").replace(/\s+/g, "");
}

function signToken(user) {
  return jwt.sign(
    { sub: String(user._id), role: user.role },
    process.env.JWT_SECRET || "dev_secret_key",
    { expiresIn: "30d" }
  );
}

exports.signupFarmer = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      password,
      village,
      district,
      state,
      farmSize,
      primaryCrops,
      profilePhotoUrl,
    } = req.body;

    const normalizedPhone = normalizePhone(phone);
    if (!fullName || !normalizedPhone || !password || !village || !district || !state) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const exists = await User.findOne({ phone: normalizedPhone });
    if (exists) {
      return res.status(409).json({ success: false, message: "Phone already registered" });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);

    const user = await User.create({
      fullName,
      phone: normalizedPhone,
      passwordHash,
      role: "farmer",
      profilePhotoUrl: profilePhotoUrl || "",
      location: { village, district, state },
      farmerProfile: {
        farmSize: farmSize || "",
        primaryCrops: Array.isArray(primaryCrops)
          ? primaryCrops
          : typeof primaryCrops === "string" && primaryCrops.trim()
            ? primaryCrops.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
      },
    });

    const token = signToken(user);
    return res.json({ success: true, token, user: user.toJSON() });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.signupCustomer = async (req, res) => {
  try {
    const { fullName, phone, password, cityOrVillage, profilePhotoUrl } = req.body;
    const normalizedPhone = normalizePhone(phone);

    if (!fullName || !normalizedPhone || !password || !cityOrVillage) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const exists = await User.findOne({ phone: normalizedPhone });
    if (exists) {
      return res.status(409).json({ success: false, message: "Phone already registered" });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);

    const user = await User.create({
      fullName,
      phone: normalizedPhone,
      passwordHash,
      role: "consumer",
      profilePhotoUrl: profilePhotoUrl || "",
      location: { cityOrVillage },
    });

    const token = signToken(user);
    return res.json({ success: true, token, user: user.toJSON() });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, password, role } = req.body;
    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone || !password) {
      return res.status(400).json({ success: false, message: "Phone and password required" });
    }

    const user = await User.findOne({ phone: normalizedPhone }).select("+passwordHash");
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ success: false, message: "Role mismatch" });
    }

    const valid = await bcrypt.compare(String(password), user.passwordHash);
    if (!valid) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    const token = signToken(user);
    return res.json({ success: true, token, user: user.toJSON() });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, user: user.toJSON() });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};