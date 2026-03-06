const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");
const {
  createProduct,
  getMyProducts,
  updateMyProduct,
  deleteMyProduct,
} = require("../controllers/productController");

// Farmer product management
router.post("/products", auth, requireRole("farmer"), createProduct);
router.get("/products", auth, requireRole("farmer"), getMyProducts);
router.patch("/products/:id", auth, requireRole("farmer"), updateMyProduct);
router.delete("/products/:id", auth, requireRole("farmer"), deleteMyProduct);

// Back-compat endpoints (older frontend)
router.post("/add-product", auth, requireRole("farmer"), (req, res, next) => {
  // map old shape to new
  req.body = {
    name: req.body.product_name || req.body.name,
    category: req.body.category || "Vegetables",
    pricePerKg: req.body.pricePerKg ?? req.body.price,
    availableQuantityKg: req.body.availableQuantityKg ?? req.body.quantity,
    imageUrls: req.body.imageUrls || [],
    isOrganic: req.body.isOrganic || false,
  };
  return createProduct(req, res, next);
});

router.get("/my-products", auth, requireRole("farmer"), getMyProducts);

module.exports = router;