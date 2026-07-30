const express = require("express");
const router = express.Router();

const orderControllersAdmin = require("../../controllers/admin/orderControllersAdmin");
const authMiddleware = require("../../middleware/authMiddleware");
const requireVerifiedUser = require("../../middleware/requireVerifiedUser");
const permit = require("../../middleware/permissionMiddleware");
const validate = require("../../middleware/validate");

const {
  orderIdSchema,
  updateOrderStatusSchema,
  getAllOrdersSchema,
} = require("../../validators/admin/order.validator");

router.get(
  "/",
  authMiddleware,
  requireVerifiedUser,
  permit("ADMIN"),
  validate(getAllOrdersSchema),
  orderControllersAdmin.getAllOrders,
);

router.get(
  "/:orderId",
  authMiddleware,
  requireVerifiedUser,
  permit("ADMIN"),
  validate(orderIdSchema),
  orderControllersAdmin.getOrderById,
);

router.patch(
  "/:orderId",
  authMiddleware,
  requireVerifiedUser,
  permit("ADMIN"),
  validate(updateOrderStatusSchema),
  orderControllersAdmin.updateOrderStatus,
);

router.delete(
  "/:orderId",
  authMiddleware,
  requireVerifiedUser,
  permit("ADMIN"),
  validate(orderIdSchema),
  orderControllersAdmin.deleteOrder,
);

module.exports = router;
