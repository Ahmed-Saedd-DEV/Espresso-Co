const express = require("express");
const router = express.Router();

const productControlles = require("../../controllers/users/productControllers");
const authMiddleware = require("../../middleware/authMiddleware");
const permit = require("../../middleware/permissionMiddleware");
const validate = require("../../middleware/validate");
const {
  productQuerySchema,
  productIdSchema,
} = require("../../validators/user/product.validator.js");

router.get("/", validate(productQuerySchema), productControlles.getProducts);
router.get("/:id", validate(productIdSchema), productControlles.getProductById);

module.exports = router;
