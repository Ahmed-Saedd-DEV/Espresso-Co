const fs = require("fs");
const path = require("path");

const redisClient = require("../../config/redis");

const scriptPath = path.join(__dirname, "tokenBucket.lua");

const tokenBucketScript = fs.readFileSync(scriptPath, "utf8");

const consumeToken = async ({ key, capacity, refillInterval, ttl }) => {
  const now = Math.floor(Date.now() / 1000);

  const result = await redisClient.eval(tokenBucketScript, {
    keys: [key],
    arguments: [
      String(capacity),
      String(refillInterval),
      String(now),
      String(ttl),
    ],
  });

  return {
    allowed: result[0] === 1,
    tokens: Number(result[1]),
    lastRefill: Number(result[2]),
  };
};

module.exports = {
  consumeToken,
};
