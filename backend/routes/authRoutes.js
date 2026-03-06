const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const {
  signupFarmer,
  signupCustomer,
  login,
  me,
} = require("../controllers/authController");

router.post("/signup/farmer", signupFarmer);
router.post("/signup/customer", signupCustomer);

// Back-compat: allow role-based signup via /signup
router.post("/signup", (req, res, next) => {
  const role = req.body?.role;
  if (role === "farmer") return signupFarmer(req, res, next);
  return signupCustomer(req, res, next);
});

router.post("/login", login);
router.get("/me", auth, me);

module.exports = router;