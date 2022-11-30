const { ApolloServer } = require("apollo-server-express");
const { createServer } = require("http");
const express = require("express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");

// The GraphQL schema
const typeDefs = require("./graphql/typeDefs");
// A map of functions which return data for the schema.
const resolvers = require("./graphql/resolvers");
//context middleware
const contextMiddleware = require("./util/contextMiddleware");
// websocket context middleware
const wsContextMiddleware = require("./util/ws-contextMiddleware");
//DB instance
const { sequelize } = require("./models/index");

// Create the schema, which will be used separately by ApolloServer and
// the WebSocket server.
const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
// This `app` is the returned value from `express()`.
const httpServer = createServer(app);

// Create our WebSocket server using the HTTP server we just set up.
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

// Save the returned server's info so we can shutdown this server later
const serverCleanup = useServer(
  { schema, context: wsContextMiddleware },
  wsServer
);

// Set up ApolloServer.
const server = new ApolloServer({
  schema,
  context: contextMiddleware,
  cache: "bounded",
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});
const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = 4000;
  // Now that our HTTP server is fully set up, we can listen to it.
  httpServer.listen(PORT, () => {
    console.log(
      `Server is now running on http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`
    );
    sequelize
      .authenticate()
      .then(() => console.log("DB Connected"))
      .catch((err) => console.log(err));
  });
};
startServer();
