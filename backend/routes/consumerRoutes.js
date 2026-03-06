const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

const {
 getProducts,
 followFarmer,
 orderProduct
} = require("../controllers/consumerController");

router.get("/products",auth,getProducts);
router.post("/follow-farmer",auth,followFarmer);
router.post("/order-product",auth,orderProduct);

module.exports = router;