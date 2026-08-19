const express = require("express");
const router = express.Router();

const reviewControllers = require("../../controllers/users/reviewControllers");
const authMiddleware = require("../../middleware/authMiddleware");
const requireVerifiedUser = require("../../middleware/requireVerifiedUser");
const validate = require("../../middleware/validate.js");
const normalizeIp = require("../../middleware/rateLimit/normalizeIp");
const reviewRateLimiter = require("../../middleware/rateLimit/reviewRateLimiter");
const {
  createReviewSchema,
  getReviewsQuerySchema,
} = require("../../validators/user/review.validator.js");

router.post(
  "/",
  normalizeIp,
  reviewRateLimiter,
  authMiddleware,
  requireVerifiedUser,
  validate(createReviewSchema),
  reviewControllers.createReview,
);
router.get(
  "/",
  normalizeIp,
  reviewRateLimiter,
  authMiddleware,
  requireVerifiedUser,
  validate(getReviewsQuerySchema),
  reviewControllers.getReviews,
);

module.exports = router;
