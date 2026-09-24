const express = require("express");
const router = express.Router();

const reviewControllersAdmin = require("../../controllers/admin/reviewControllersAdmin");
const authMiddleware = require("../../middleware/authMiddleware");
const permit = require("../../middleware/permissionMiddleware");
const validate = require("../../middleware/validate");
const {
  getAllReviewsQuerySchema,
  reviewIdSchema,
  bulkDeleteReviewsSchema,
} = require("../../validators/admin/review.validator");

router.get(
  "/",
  authMiddleware,
  permit("ADMIN"),
  validate(getAllReviewsQuerySchema),
  reviewControllersAdmin.getAllReviews,
);
router.post(
  "/bulk-delete",
  authMiddleware,
  permit("ADMIN"),
  validate(bulkDeleteReviewsSchema),
  reviewControllersAdmin.deleteManyReviews,
);
router.delete(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  validate(reviewIdSchema),
  reviewControllersAdmin.deleteReview,
);

module.exports = router;
