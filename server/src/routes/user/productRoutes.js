const express = require("express");
const router = express.Router();

const productControllers = require("../../controllers/users/productControllers");
const validate = require("../../middleware/validate");
const normalizeIp = require("../../middleware/rateLimit/normalizeIp");
const productRateLimiter = require("../../middleware/rateLimit/productRateLimiter");
const {
  productQuerySchema,
  productIdSchema,
} = require("../../validators/user/product.validator.js");

router.get(
  "/",
  normalizeIp,
  productRateLimiter,
  validate(productQuerySchema),
  productControllers.getProducts,
);
router.get(
  "/:id",
  normalizeIp,
  productRateLimiter,
  validate(productIdSchema),
  productControllers.getProductById,
);

module.exports = router;
