import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

client.on("error", function (err) {
  console.log("Error " + err);
});

client.connect();

export default client;

