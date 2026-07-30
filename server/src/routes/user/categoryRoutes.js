const express = require("express");
const router = express.Router();

const categoryControllers = require("../../controllers/users/categoryControllers");
const authMiddleware = require("../../middleware/authMiddleware");
const validate = require("../../middleware/validate");
const {
  categoryQuerySchema,
  categoryIdSchema,
} = require("../../validators/user/category.validator.js");

router.get(
  "/",
  validate(categoryQuerySchema),
  categoryControllers.getCategories,
);
router.get(
  "/:id",
  validate(categoryIdSchema),
  categoryControllers.getCategoryById,
);

module.exports = router;
