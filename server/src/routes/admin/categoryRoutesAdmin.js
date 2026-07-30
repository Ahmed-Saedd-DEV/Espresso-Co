const express = require("express");
const router = express.Router();

const categoryControllers = require("../../controllers/admin/categoryControllersAdmin");
const authMiddleware = require("../../middleware/authMiddleware");
const permit = require("../../middleware/permissionMiddleware");
const validate = require("../../middleware/validate");
const {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} = require("../../validators/admin/category.validator");

router.post(
  "/",
  authMiddleware,
  permit("ADMIN"),
  validate(createCategorySchema),
  categoryControllers.createCategory,
);

router.patch(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  validate(updateCategorySchema),
  categoryControllers.updateCategory,
);

router.delete(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  validate(categoryIdSchema),
  categoryControllers.deleteCategory,
);

module.exports = router;
