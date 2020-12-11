const { ApolloError, ApolloServer, gql } = require("apollo-server-koa");
const depthLimit = require("graphql-depth-limit");
const { RedisPubSub } = require("graphql-redis-subscriptions");
const jwt = require("jsonwebtoken");
const { config } = require("../config");
const { resolvers } = require("../graphql/resolvers");
const { types } = require("../graphql/types");
const { Mutation } = require("../graphql/types/mutation");
const { Query } = require("../graphql/types/query");
const { Subscription } = require("../graphql/types/subscription");
const { logger } = require("../logger");
const { getNewRedis } = require("./redis");

const schemaDefinition = gql`
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

const apolloServer = new ApolloServer({
  context: ({ ctx, connection }) => {
    if (connection) {
      return { ctx: connection.context };
    }
    return { ctx };
  },
  formatError: (error) => {
    if (error instanceof ApolloError || error.originalError instanceof ApolloError) {
      return error;
    }

    let context = {
      gqlmessage: error.message,
    };

    if (error.source) {
      context = {
        ...context,
        query: error.source.body,
      };
    }

    if (error.originalError) {
      context = {
        ...context,
        exception_message: error.originalError.message,
        exception_stack: error.originalError.stack,
      };
    }
    logger.error("Problems executing graphql query", context);
    return error;
  },
  introspection: config.showPlayground,
  playground: config.showPlayground,
  resolvers,
  subscriptions: {
    onConnect: (connectionParams, websocket, context) => {
      const token = connectionParams.authToken;
      if (token) {
        let data;
        try {
          data = jwt.verify(token, config.appKeys[0]);
          return { userId: data.userId };
        } catch (err) {
          logger.debug("Could not validate token", { token });
        }
      }
      return {};
    },
  },
  typeDefs: [schemaDefinition, ...types, Query, Mutation, Subscription],
  uploads: {
    maxFileSize: config.gqlMaxFileSize,
    maxFiles: config.gqlMaxFiles,
  },
  validationRules: [depthLimit(config.gqlDepthLimit)],
});

const graphqlInitializer = (app) => {
  apolloServer.applyMiddleware({ app, path: config.gqlPath, disableHealthCheck: true });
};

const graphqlInstall = (server) => apolloServer.installSubscriptionHandlers(server);

const pubsub = new RedisPubSub({
  publisher: getNewRedis(),
  subscriber: getNewRedis(),
});

const shutdownSubscriptions = () => pubsub.close();

const CARD_ADDED = "CARD_ADDED";

module.exports = {
  apolloServer,
  graphqlInitializer,
  graphqlInstall,
  pubsub,
  shutdownSubscriptions,
  CARD_ADDED,
};
