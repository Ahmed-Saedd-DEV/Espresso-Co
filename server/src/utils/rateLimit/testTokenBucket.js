const redisClient = require("../../config/redis");
const { consumeToken } = require("./tokenBucket");

const runTest = async () => {
  await redisClient.connect();

  await redisClient.del("login:rate-limit:test-ip");

  const result = await consumeToken({
    key: "login:rate-limit:test-ip",
    capacity: 5,
    refillInterval: 10,
    ttl: 60,
  });

  console.log(result);
  const result2 = await consumeToken({
    key: "login:rate-limit:test-ip",
    capacity: 5,
    refillInterval: 10,
    ttl: 60,
  });

  console.log(result2);
  const result3 = await consumeToken({
    key: "login:rate-limit:test-ip",
    capacity: 5,
    refillInterval: 10,
    ttl: 60,
  });

  console.log(result3);
  const result4 = await consumeToken({
    key: "login:rate-limit:test-ip",
    capacity: 5,
    refillInterval: 10,
    ttl: 60,
  });
  console.log(result4);
  const result5 = await consumeToken({
    key: "login:rate-limit:test-ip",
    capacity: 5,
    refillInterval: 10,
    ttl: 60,
  });

  console.log(result5);
  // await new Promise((resolve) => setTimeout(resolve, 10000));
  const result6 = await consumeToken({
    key: "login:rate-limit:test-ip",
    capacity: 5,
    refillInterval: 10,
    ttl: 60,
  });

  console.log(result6);
  const ttl = await redisClient.ttl("login:rate-limit:test-ip");
  console.log("TTL:", ttl);
  const exists = await redisClient.exists("login:rate-limit:test-ip");
  console.log("Exists:", exists);
  const deleteResult = await redisClient.del("login:rate-limit:test-ip");
  console.log("Delete Result:", deleteResult);
  const existsAfterDelete = await redisClient.exists("login:rate-limit:test-ip");
  console.log("Exists After Delete:", existsAfterDelete);
  const requests = Array.from({ length: 10 }, () =>
  consumeToken({
    key: "login:rate-limit:test-ip",
    capacity: 5,
    refillInterval: 10,
    ttl: 60,
  }),
);
  const results = await Promise.all(requests);
  console.log(results);
};

runTest();
