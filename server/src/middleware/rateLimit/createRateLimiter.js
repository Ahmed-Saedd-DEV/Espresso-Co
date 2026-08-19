const { consumeToken } = require("../../utils/rateLimit/tokenBucket");

const createRateLimiter = ({ prefix, capacity, refillInterval, ttl }) => {
  return async (req, res, next) => {
    const ip = req.clientIp;

    try {
      const key = `${prefix}:${ip}`;

      const result = await consumeToken({
        key,
        capacity,
        refillInterval,
        ttl,
      });

      if (!result.allowed) {
        return res.status(429).json({
          error: "Too many requests. Please try again later.",
        });
      }

      next();
    } catch (error) {
      console.error("Error in rate limiter:", error);

      return res.status(503).json({
        error: "Rate limiting service unavailable",
      });
    }
  };
};

module.exports = createRateLimiter;
