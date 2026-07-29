const express = require("express");
const router = express.Router();

const orderControllersAdmin = require("../../controllers/admin/orderControllersAdmin");
const authMiddleware = require("../../middleware/authMiddleware");
const requireVerifiedUser = require("../../middleware/requireVerifiedUser");
const permit = require("../../middleware/permissionMiddleware");

router.get("/", authMiddleware, requireVerifiedUser, permit("admin"), orderControllersAdmin.getAllOrders);
router.get("/:orderId", authMiddleware, requireVerifiedUser, permit("admin"), orderControllersAdmin.getOrderById);
router.patch("/:orderId", authMiddleware, requireVerifiedUser, permit("admin"), orderControllersAdmin.updateOrderStatus);
router.delete("/:orderId", authMiddleware, requireVerifiedUser, permit("admin"), orderControllersAdmin.deleteOrder); 
