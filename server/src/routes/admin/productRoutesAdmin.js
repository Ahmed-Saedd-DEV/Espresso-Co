const express = require("express");
const router = express.Router();

const productControllers = require("../../controllers/admin/productControllersAdmin");
const authMiddleware = require("../../middleware/authMiddleware");
const requireVerifiedUser = require("../../middleware/requireVerifiedUser");
const permit = require("../../middleware/permissionMiddleware");
const upload = require("../../middleware/upload");
const validate = require("../../middleware/validate");

const {
  getAllProductsQuerySchema,
  createProductSchema,
  updateProductSchema,
  productIdSchema,
  deleteImageSchema,
} = require("../../validators/admin/product.validator");

router.get(
  "/",
  authMiddleware,
  requireVerifiedUser,
  permit("ADMIN"),
  validate(getAllProductsQuerySchema),
  productControllers.getAllProductsAdmin,
);

router.post(
  "/",
  authMiddleware,
  permit("ADMIN"),
  validate(createProductSchema),
  productControllers.createProduct,
);

router.patch(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  validate(updateProductSchema),
  productControllers.updateProduct,
);

router.delete(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  validate(productIdSchema),
  productControllers.deleteProduct,
);

router.post(
  "/:id/images",
  authMiddleware,
  permit("ADMIN"),
  validate(productIdSchema),
  upload.array("images", 5),
  productControllers.createImageProduct,
);

router.delete(
  "/:id/images/:imageId",
  authMiddleware,
  permit("ADMIN"),
  validate(deleteImageSchema),
  productControllers.deleteImageProduct,
);

module.exports = router;
