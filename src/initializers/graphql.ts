import { ApolloServer, gql } from "apollo-server-koa";
import * as depthLimit from "graphql-depth-limit";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { graphqlUploadKoa } from "graphql-upload";
import * as mount from "koa-mount";
import { config } from "../config";
import { resolvers } from "../graphql/resolvers";
import { types } from "../graphql/types";
import { Mutation } from "../graphql/types/mutation";
import { Query } from "../graphql/types/query";
import { Subscription } from "../graphql/types/subscription";
import { logger } from "../logger";
import { getNewRedis } from "./redis";

const schemaDefinition = gql`
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

export const apolloServer: ApolloServer = new ApolloServer({
  context: ({ ctx, connection }) => {
    if (connection) {
      return { ctx: connection.context }
    }
    return { ctx };
  },
  introspection: config.showPlayground,
  playground: config.showPlayground,
  resolvers,
  typeDefs: [schemaDefinition, ...types, Query, Mutation, Subscription],
  uploads: false,
  validationRules: [depthLimit(config.gqlDepthLimit)],
});

export const graphqlInitializer = app => {
  app.use(
    mount(config.gqlPath, graphqlUploadKoa({ maxFileSize: config.gqlMaxFileSize, maxFiles: config.gqlMaxFiles })),
  );
  apolloServer.applyMiddleware({ app, path: config.gqlPath, disableHealthCheck: true });
};

export const graphqlInstall = server => apolloServer.installSubscriptionHandlers(server);

export const pubsub = new RedisPubSub({
  publisher: getNewRedis(),
  subscriber: getNewRedis(),
});

export const CARD_ADDED = "CARD_ADDED";
