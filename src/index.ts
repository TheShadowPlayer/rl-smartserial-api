import { getSchema } from "config/schema";
import { createServer } from "http";
import { createYoga, createPubSub } from "graphql-yoga";
import { SerialDevicesType } from "types/general/general";

const pubsub = createPubSub();

const serialDevices: SerialDevicesType = {};

const yoga = createYoga({
  schema: getSchema(pubsub, serialDevices),
  cors: false,
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.info("Server is running on http://localhost:4000/graphql");
});
