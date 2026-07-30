const express = require("express");
const router = express.Router();

const orderControllers = require("../../controllers/users/orderControllers");
const authMiddleware = require("../../middleware/authMiddleware");
const requireVerifiedUser = require("../../middleware/requireVerifiedUser");
const validate = require("../../middleware/validate");
const {
  createOrderSchema,
  orderIdSchema,
  getOrdersQuerySchema,
  updateOrderStatusSchema,
} = require("../../validators/user/order.validator.js");

router.post(
  "/",
  authMiddleware,
  requireVerifiedUser,
  validate(createOrderSchema),
  orderControllers.createOrder,
);
router.get(
  "/",
  authMiddleware,
  requireVerifiedUser,
  validate(getOrdersQuerySchema),
  orderControllers.getOrders,
);
router.get(
  "/:orderId",
  authMiddleware,
  requireVerifiedUser,
  validate(orderIdSchema),
  orderControllers.getOrderById,
);
router.patch(
  "/:orderId",
  authMiddleware,
  requireVerifiedUser,
  validate(updateOrderStatusSchema),
  orderControllers.updateOrderStatus,
);

module.exports = router;
