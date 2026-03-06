const Post = require("../models/Post");
const Follow = require("../models/Follow");

exports.createPost = async (req, res) => {
  try {
    const {
      mediaType,
      mediaUrl,
      cropType,
      daysAfterPlanting,
      description,
      problem,
      isImportant,
      importantType,
    } = req.body;

    if (!mediaType || !mediaUrl || !cropType || daysAfterPlanting == null) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const post = await Post.create({
      farmer: req.user.id,
      mediaType,
      mediaUrl,
      cropType,
      daysAfterPlanting: Number(daysAfterPlanting),
      description: description || "",
      problem: problem || "",
      isImportant: Boolean(isImportant),
      importantType: importantType || undefined,
    });

    return res.json({ success: true, data: post });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.listFeed = async (req, res) => {
  try {
    const { followingOnly, cropType } = req.query;
    const filter = {};
    if (cropType) filter.cropType = { $regex: String(cropType), $options: "i" };

    if (String(followingOnly) === "true") {
      const follows = await Follow.find({ consumer_id: req.user.id }).select("farmer_id");
      const farmerIds = follows.map((f) => f.farmer_id);
      filter.farmer = { $in: farmerIds };
    }

    const posts = await Post.find(filter)
      .populate("farmer", "fullName profilePhotoUrl location")
      .sort({ createdAt: -1 })
      .limit(100);

    return res.json({ success: true, data: posts });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const uid = String(req.user.id);
    const idx = post.likes.findIndex((id) => String(id) === uid);
    if (idx >= 0) post.likes.splice(idx, 1);
    else post.likes.push(req.user.id);
    await post.save();

    return res.json({ success: true, data: { likesCount: post.likes.length, liked: idx < 0 } });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.toggleSave = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const uid = String(req.user.id);
    const idx = post.saves.findIndex((id) => String(id) === uid);
    if (idx >= 0) post.saves.splice(idx, 1);
    else post.saves.push(req.user.id);
    await post.save();

    return res.json({ success: true, data: { savesCount: post.saves.length, saved: idx < 0 } });
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

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    post.comments.push({ user: req.user.id, text: String(text).trim() });
    await post.save();

    return res.json({ success: true, data: post.comments[post.comments.length - 1] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("comments.user", "fullName profilePhotoUrl");
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    return res.json({ success: true, data: post.comments });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

