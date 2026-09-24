const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  // The bundled Windows Redis 3.x server does not implement RESP3 HELLO negotiation.
  RESP: 2,
});

redisClient.on("error", (error) => {
  console.error("Redis Client Error:", error);
});

module.exports = redisClient;
