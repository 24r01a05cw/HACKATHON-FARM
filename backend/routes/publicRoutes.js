const router = require("express").Router();

const auth = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");

const {
  listProducts,
  getProductById,
} = require("../controllers/productController");

const {
  listFeed,
  toggleLike: toggleLikePost,
  toggleSave: toggleSavePost,
  addComment: addCommentPost,
  getComments: getPostComments,
} = require("../controllers/postController");

const {
  listReels,
  toggleLike: toggleLikeReel,
  toggleSave: toggleSaveReel,
  addComment: addCommentReel,
  getComments: getReelComments,
} = require("../controllers/reelController");

const { addReview, listReviews } = require("../controllers/reviewController");
const { getUserProfile, updateMySettings } = require("../controllers/userController");

// Marketplace (public-ish; requires auth only if your frontend always sends it)
router.get("/products", listProducts);
router.get("/products/:id", getProductById);

// Feed / Reels (requires login to keep things simple for hackathon)
router.get("/feed", auth, listFeed);
router.get("/reels", auth, listReels);

// Post interactions
router.post("/posts/:id/like", auth, toggleLikePost);
router.post("/posts/:id/save", auth, toggleSavePost);
router.post("/posts/:id/comments", auth, addCommentPost);
router.get("/posts/:id/comments", auth, getPostComments);

// Reel interactions
router.post("/reels/:id/like", auth, toggleLikeReel);
router.post("/reels/:id/save", auth, toggleSaveReel);
router.post("/reels/:id/comments", auth, addCommentReel);
router.get("/reels/:id/comments", auth, getReelComments);

// Reviews
router.get("/products/:id/reviews", listReviews);
router.post("/products/:id/reviews", auth, requireRole("consumer"), addReview);

// Profile / Settings
router.get("/users/:id", getUserProfile);
router.patch("/users/me/settings", auth, updateMySettings);

module.exports = router;

