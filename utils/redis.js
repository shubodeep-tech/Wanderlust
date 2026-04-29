// Redis is disabled for Render deployment (no local Redis available).
// To re-enable: set REDIS_URL env var and uncomment below.

/*
const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

redisClient.on("error", (err) => console.log("Redis Error", err));

(async () => {
  await redisClient.connect();
  console.log("Redis Connected");
})();

module.exports = redisClient;
*/


module.exports = {
  get:      async () => null,
  set:      async () => null,
  del:      async () => null,
  flushAll: async () => null,
};