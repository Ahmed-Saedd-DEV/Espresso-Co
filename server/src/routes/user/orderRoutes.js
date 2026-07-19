const express = require("express");
const router = express.Router();

const orderControllers = require("../../controllers/users/orderControllers");
const authMiddleware = require("../../middleware/authMiddleware");
const requireVerifiedUser = require("../../middleware/requireVerifiedUser");

router.post(
  "/orders",
  authMiddleware,
  requireVerifiedUser,
  orderControllers.createOrder,
);

module.exports = router;
