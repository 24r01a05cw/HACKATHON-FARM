const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");

const {
  getProducts,
  followFarmer,
  unfollowFarmer,
  getFollowing,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getCart,
  addCartItem,
  removeCartItem,
  checkout,
  getMyOrders,
  orderProduct
} = require("../controllers/consumerController");

// Marketplace browsing (any logged-in user can browse)
router.get("/products", auth, getProducts);

// Follow (consumer-only)
router.post("/follow/:farmerId", auth, requireRole("consumer"), followFarmer);
router.delete("/follow/:farmerId", auth, requireRole("consumer"), unfollowFarmer);
router.get("/following", auth, requireRole("consumer"), getFollowing);

// Wishlist (consumer-only)
router.get("/wishlist", auth, requireRole("consumer"), getWishlist);
router.post("/wishlist/:productId", auth, requireRole("consumer"), addToWishlist);
router.delete("/wishlist/:productId", auth, requireRole("consumer"), removeFromWishlist);

// Cart (consumer-only)
router.get("/cart", auth, requireRole("consumer"), getCart);
router.post("/cart/items", auth, requireRole("consumer"), addCartItem);
router.delete("/cart/items/:productId", auth, requireRole("consumer"), removeCartItem);

// Orders (consumer-only)
router.post("/orders/checkout", auth, requireRole("consumer"), checkout);
router.get("/orders", auth, requireRole("consumer"), getMyOrders);

// Back-compat endpoints (older frontend)
router.post("/follow-farmer", auth, requireRole("consumer"), followFarmer);
router.post("/order-product", auth, requireRole("consumer"), orderProduct);

module.exports = router;