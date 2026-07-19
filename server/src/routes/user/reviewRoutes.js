const express = require("express");
const router = express.Router();

const reviewControllers = require("../../controllers/users/reviewControllers");
const authMiddleware = require("../../middleware/authMiddleware");
const requireVerifiedUser = require("../../middleware/requireVerifiedUser");

router.post(
  "/reviews",
  authMiddleware,
  requireVerifiedUser,
  reviewControllers.createReview,
);

module.exports = router;
