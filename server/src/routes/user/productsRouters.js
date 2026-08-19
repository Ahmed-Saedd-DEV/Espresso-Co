const express = require("express");
const router = express.Router();

const productControlles = require("../../controllers/users/productControllers");
const authMiddleware = require("../../middleware/authMiddleware");
const permit = require("../../middleware/permissionMiddleware");
const validate = require("../../middleware/validate");
const normalizeIp = require("../../middleware/rateLimit/normalizeIp");
const productRateLimiter = require("../../middleware/rateLimit/productRateLimiter");
const {
  productQuerySchema,
  productIdSchema,
} = require("../../validators/user/product.validator.js");

router.get("/", normalizeIp, productRateLimiter, validate(productQuerySchema), productControlles.getProducts);
router.get("/:id", normalizeIp, productRateLimiter, validate(productIdSchema), productControlles.getProductById);

module.exports = router;
