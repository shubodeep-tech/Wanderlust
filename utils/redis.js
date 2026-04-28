const { createClient } = require("redis");

const client = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

client.on("error", (err) => console.log("Redis Error:", err));

(async () => {
  await client.connect();
  console.log("Redis Connected");
})();

module.exports = client;