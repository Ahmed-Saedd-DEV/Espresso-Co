const express = require("express");
const router = express.Router();
const cartControllers = require("../../controllers/users/cartControllers");
const authMiddleware = require("../../middleware/authMiddleware");
const requireVerifiedUser = require("../../middleware/requireVerifiedUser");

router.get("/", authMiddleware, requireVerifiedUser, cartControllers.getCart);
router.post(
  "/",
  authMiddleware,
  requireVerifiedUser,
  cartControllers.addToCart,
);
router.patch(
  "/:id",
  authMiddleware,
  requireVerifiedUser,
  cartControllers.updateCartItem,
);
router.delete(
  "/:id",
  authMiddleware,
  requireVerifiedUser,
  cartControllers.removeFromCart,
);

module.exports = router;
