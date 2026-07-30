const express = require("express");
const router = express.Router();
const cartControllers = require("../../controllers/users/cartControllers");
const authMiddleware = require("../../middleware/authMiddleware");
const requireVerifiedUser = require("../../middleware/requireVerifiedUser");
const validate = require("../../middleware/validate");
const {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} = require("../../validators/user/cart.validator.js");

router.get("/", authMiddleware, requireVerifiedUser, cartControllers.getCart);
router.post(
  "/",
  authMiddleware,
  requireVerifiedUser,
  validate(addToCartSchema),
  cartControllers.addToCart,
);
router.patch(
  "/:productId",
  authMiddleware,
  requireVerifiedUser,
  validate(updateCartItemSchema),
  cartControllers.updateCartItem,
);
router.delete(
  "/:productId",
  authMiddleware,
  requireVerifiedUser,
  validate(removeCartItemSchema),
  cartControllers.removeFromCart,
);

module.exports = router;
