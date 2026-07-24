const express = require("express");
const router = express.Router();

const productControllers = require("../../controllers/admin/productControllersAdmin");
const authMiddleware = require("../../middleware/authMiddleware");
const permit = require("../../middleware/permissionMiddleware");
const upload = require("../../middleware/upload");

router.post(
  "/",
  authMiddleware,
  permit("ADMIN"),
  productControllers.createProduct,
);
router.patch(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  productControllers.updateProduct,
);
router.delete(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  productControllers.deleteProduct,
);

router.post(
  "/:id/images",
  authMiddleware,
  permit("ADMIN"),
  upload.array("images", 5),
  productControllers.createImageProduct,
);
router.delete(
  "/:id/images/:imageId",
  authMiddleware,
  permit("ADMIN"),
  productControllers.deleteImageProduct,
);

module.exports = router;
