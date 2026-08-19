const createRateLimiter = require("./createRateLimiter");

const productRateLimiter = createRateLimiter({
  prefix: "products_rate_limit",
  capacity: 30,
  refillInterval: 60,
  ttl: 3600,
});

module.exports = productRateLimiter;