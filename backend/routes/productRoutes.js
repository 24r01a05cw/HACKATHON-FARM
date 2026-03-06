const express = require("express");
const router = express.Router();

router.post("/add-product", (req, res) => {
  res.json({
    success: true,
    message: "Product added"
  });
});

router.get("/my-products", (req, res) => {
  res.json({
    success: true,
    message: "My products fetched"
  });
});

module.exports = router;