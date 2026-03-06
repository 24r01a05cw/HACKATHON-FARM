const router = require("express").Router();

const auth = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");

const { getDashboard, getFollowers, getOrders, updateOrderStatus } = require("../controllers/farmerController");
const { createPost } = require("../controllers/postController");
const { createReel } = require("../controllers/reelController");

router.use(auth, requireRole("farmer"));

router.get("/dashboard", getDashboard);
router.get("/followers", getFollowers);

router.get("/orders", getOrders);
router.patch("/orders/:id/status", updateOrderStatus);

router.post("/posts", createPost);
router.post("/reels", createReel);

module.exports = router;

