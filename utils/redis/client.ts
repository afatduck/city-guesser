import { createClient } from "redis";

const client = createClient();

client.on("error", function (err) {
  console.log("Error " + err);
});

client.connect();

export default client;

