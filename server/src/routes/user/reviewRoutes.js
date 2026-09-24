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
  updateReviewSchema,
  deleteReviewSchema,
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
  validate(getReviewsQuerySchema),
  reviewControllers.getReviews,
);

router.patch(
  "/:id",
  authMiddleware,
  requireVerifiedUser,
  validate(updateReviewSchema),
  reviewControllers.updateReview,
);

router.delete(
  "/:id",
  authMiddleware,
  requireVerifiedUser,
  validate(deleteReviewSchema),
  reviewControllers.deleteReview,
);

module.exports = router;
