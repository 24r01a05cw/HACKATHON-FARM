const Reel = require("../models/Reel");

exports.createReel = async (req, res) => {
  try {
    const { videoUrl, caption } = req.body;
    if (!videoUrl) return res.status(400).json({ success: false, message: "videoUrl required" });

    const reel = await Reel.create({
      farmer: req.user.id,
      videoUrl,
      caption: caption || "",
    });

    return res.json({ success: true, data: reel });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.listReels = async (req, res) => {
  try {
    const reels = await Reel.find()
      .populate("farmer", "fullName profilePhotoUrl location")
      .sort({ createdAt: -1 })
      .limit(100);
    return res.json({ success: true, data: reels });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ success: false, message: "Reel not found" });

    const uid = String(req.user.id);
    const idx = reel.likes.findIndex((id) => String(id) === uid);
    if (idx >= 0) reel.likes.splice(idx, 1);
    else reel.likes.push(req.user.id);
    await reel.save();

    return res.json({ success: true, data: { likesCount: reel.likes.length, liked: idx < 0 } });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.toggleSave = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ success: false, message: "Reel not found" });

    const uid = String(req.user.id);
    const idx = reel.saves.findIndex((id) => String(id) === uid);
    if (idx >= 0) reel.saves.splice(idx, 1);
    else reel.saves.push(req.user.id);
    await reel.save();

    return res.json({ success: true, data: { savesCount: reel.saves.length, saved: idx < 0 } });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !String(text).trim()) {
      return res.status(400).json({ success: false, message: "text required" });
    }

    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ success: false, message: "Reel not found" });

    reel.comments.push({ user: req.user.id, text: String(text).trim() });
    await reel.save();

    return res.json({ success: true, data: reel.comments[reel.comments.length - 1] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id).populate("comments.user", "fullName profilePhotoUrl");
    if (!reel) return res.status(404).json({ success: false, message: "Reel not found" });
    return res.json({ success: true, data: reel.comments });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

