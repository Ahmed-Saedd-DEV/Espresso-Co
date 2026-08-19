const createRateLimiter = require("./createRateLimiter");

const reviewRateLimiter = createRateLimiter({
  prefix: "reviews_rate_limit",
  capacity: 10,
  refillInterval: 60,
  ttl: 3600,
});

module.exports = reviewRateLimiter;