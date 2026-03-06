const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { upload } = require("../middleware/upload");

// Upload any image/video (profile photo, product image, post media, reel video)
// multipart/form-data with field name: file
router.post("/", auth, upload.single("file"), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ success: false, message: "file required" });
  const urlPath = `/uploads/${file.filename}`;
  return res.json({ success: true, url: urlPath });
});

module.exports = router;

