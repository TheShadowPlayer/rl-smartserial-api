const { GraphQLServer, PubSub } = require("graphql-yoga");
const SerialPort = require("serialport");

// Create an object to store the serial port instances and their corresponding device paths
const serialDevices = {};

// Create a new instance of PubSub to handle subscriptions
const pubsub = new PubSub();

// Define the GraphQL schema for the application
const typeDefs = `
  type Query {
    getDataFromDevice(path: String!): String
  }

  type Subscription {
    newMessageFromDevice(path: String!): String
  }

  type Mutation {
    setSerialDevice(path: String!): String
  }
`;

// Define the resolvers for the GraphQL schema
const resolvers = {
  Query: {
    getDataFromDevice: (parent, args) => {
      // Get the serial device instance for the specified path
      const port = serialDevices[args.path];

      // Read data from the device using the serial port
      port.read((error, data) => {
        if (error) {
          // Return an error if there was a problem reading from the device
          return error.message;
        } else {
          // Return the data from the device
          return data;
        }
      });
    },
  },
  Subscription: {
    newMessageFromDevice: {
      subscribe: (parent, args) => {
        // Get the serial device instance for the specified path
        const port = serialDevices[args.path];

        // Create an async iterator for the 'newMessageFromDevice' event on the serial device instance
        return port.asyncIterator("newMessageFromDevice");
      },
    },
  },
  Mutation: {
    setSerialDevice: (parent, args) => {
      // Create a new serial port instance for the specified path
      const port = new SerialPort(args.path);

      // Save the serial port instance and its corresponding device path in the serialDevices object
      serialDevices[args.path] = port;

      // Listen for data from the serial device
      port.on("data", (data) => {
        // Publish the new data to the 'newMessageFromDevice' event on the serial device instance
        port.publish("newMessageFromDevice", { newMessageFromDevice: data });
      });

      // Return a success message
      return "Successfully set serial device";
    },
  },
};

// Create a new instance of the GraphQLServer
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });

// Start the server
server.start(() => console.log("Server is running on localhost:4000"));
