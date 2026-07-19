const express = require("express");
const router = express.Router();
const cartControllers = require("../../controllers/users/cartControllers");
const authMiddleware = require("../../middleware/authMiddleware");
const requireVerifiedUser = require("../../middleware/requireVerifiedUser");

router.get(
  "/cart",
  authMiddleware,
  requireVerifiedUser,
  cartControllers.getCart,
);
router.post(
  "/cart",
  authMiddleware,
  requireVerifiedUser,
  cartControllers.addToCart,
);
router.patch(
  "/cart/:id",
  authMiddleware,
  requireVerifiedUser,
  cartControllers.updateCartItem,
);
router.delete(
  "/cart/:id",
  authMiddleware,
  requireVerifiedUser,
  cartControllers.removeFromCart,
);

module.exports = router;
