const express = require("express");
const router = express.Router();

const reviewControllers = require("../../controllers/users/reviewControllers");
const authMiddleware = require("../../middleware/authMiddleware");
const requireVerifiedUser = require("../../middleware/requireVerifiedUser");

router.post(
  "/",
  authMiddleware,
  requireVerifiedUser,
  reviewControllers.createReview,
);
router.get(
  "/",
  authMiddleware,
  requireVerifiedUser,
  reviewControllers.getReviews,
);

module.exports = router;
