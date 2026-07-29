const express = require("express");
const router = express.Router();

const orderControllers = require("../../controllers/users/orderControllers");
const authMiddleware = require("../../middleware/authMiddleware");
const requireVerifiedUser = require("../../middleware/requireVerifiedUser");

router.post(
  "/",
  authMiddleware,
  requireVerifiedUser,
  orderControllers.createOrder,
);
router.get("/", authMiddleware, requireVerifiedUser, orderControllers.getOrders);
router.get("/:orderId", authMiddleware, requireVerifiedUser, orderControllers.getOrderById);
router.patch("/:orderId", authMiddleware, requireVerifiedUser, orderControllers.updateOrderStatus);

module.exports = router;
