import { RedisClientType } from "redis";
import { createClient } from "redis";

let client: RedisClientType<any>;

const create = (): RedisClientType => {
  const c = createClient({
    url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  });

  c.on("error", function (err) {
    console.log("Error " + err);
  });

  c.connect();
  return c as any;
}

if (!global.client || !global.client.isOpen) {
    client = create();
    global.client = client;
  }
client = global.client;


export default client;

declare global {
  var client: RedisClientType<any, any, any>;
}

