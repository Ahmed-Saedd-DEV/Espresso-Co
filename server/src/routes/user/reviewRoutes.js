const express = require("express");
const router = express.Router();

const reviewControllers = require("../../controllers/users/reviewControllers");
const authMiddleware = require("../../middleware/authMiddleware");
const requireVerifiedUser = require("../../middleware/requireVerifiedUser");
const validate = require("../../middleware/validate.js");
const {
  createReviewSchema,
  getReviewsQuerySchema,
} = require("../../validators/user/review.validator.js");

router.post(
  "/",
  authMiddleware,
  requireVerifiedUser,
  validate(createReviewSchema),
  reviewControllers.createReview,
);
router.get(
  "/",
  authMiddleware,
  requireVerifiedUser,
  validate(getReviewsQuerySchema),
  reviewControllers.getReviews,
);

module.exports = router;
