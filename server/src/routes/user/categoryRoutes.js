const express = require("express");
const router = express.Router();

const categoryControllers = require("../../controllers/users/categoryControllers");
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
