import { sendMessage } from "api/mutation/sendMessage";
import { startSerialDeviceConnection } from "api/mutation/startSerialDeviceConnection";
import { getDevicesList } from "api/query/getDevicesList";
import { SUBSCRIPTIONS } from "api/subscription/subscriptions";
import { createSchema, PubSub } from "graphql-yoga";
import { SerialDevicesType } from "types/general/general";
import { SendMessageArg } from "types/mutation/sendMessage.types";
import { StartSerialDeviceConnectionArgs } from "types/mutation/startSerialDeviceConnection.types";
import { DeviceMessageInput } from "types/subscription/deviceMessage.types";

type PubSubPublishArgsByKey = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: [] | [any] | [number | string, any];
};

export const getSchema = (
  pubSub: PubSub<PubSubPublishArgsByKey>,
  serialDevices: SerialDevicesType
) =>
  createSchema({
    typeDefs: `
type Query {
  getDevicesList: DeviceListResult
}

type Subscription {
  deviceMessage(path: String!): DeviceMessage
}

type Mutation {
  startSerialDeviceConnection(options: StartSerialDeviceConnectionInput!): StartSerialDeviceConnectionResult
  sendMessage(input: SendMessageInput!): SendMessageResult
}

input SendMessageInput {
  path: String!
  message: String!
}

type SendMessageResult {
  path: String!
  message: String!
  date: String!
}

type DeviceMessage {
  path: String!
  message: String!
  date: String!
}

input StartSerialDeviceConnectionInput {
  path: String!
  baudRate: Int!
  lock: Boolean
  dataBits: Int
  parity: String
  rtscts: Boolean
  xon: Boolean
  xoff: Boolean
  xany: Boolean
  hupcl: Boolean
}

type StartSerialDeviceConnectionResult {
  successful: Boolean
  options: SerialDeviceOptions
}

type SerialDeviceOptions {
  path: String!
  baudRate: Int!
  lock: Boolean
  dataBits: Int
  parity: String
  rtscts: Boolean
  xon: Boolean
  xoff: Boolean
  xany: Boolean
  hupcl: Boolean
}

type DeviceListResult {
  ports: [DevicePort]
}

type DevicePort {
  locationId: String
  manufacturer: String
  path: String!
  pnpId: String
  productId: String
  serialNumber: String
  vendorId: String
}
`,
    resolvers: {
      Query: {
        getDevicesList: async () => await getDevicesList(),
      },
      Mutation: {
        startSerialDeviceConnection: async (
          parent,
          args: StartSerialDeviceConnectionArgs
        ) =>
          await startSerialDeviceConnection(
            args.options,
            (subscription, data) =>
              pubSub.publish(subscription, data.path, { deviceMessage: data }),
            serialDevices
          ),
        sendMessage: (parent, args: SendMessageArg) =>
          sendMessage(args.input, serialDevices),
      },
      Subscription: {
        deviceMessage: {
          subscribe: (parent, args: DeviceMessageInput) =>
            pubSub.subscribe(SUBSCRIPTIONS.SERIAL_MESSAGE, args.path),
        },
      },
    },
  });
