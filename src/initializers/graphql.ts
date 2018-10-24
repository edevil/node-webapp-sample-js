import { ApolloServer, gql } from "apollo-server-koa";
import * as depthLimit from "graphql-depth-limit";
import { graphqlUploadKoa } from "graphql-upload";
import * as mount from "koa-mount";
import { config } from "../config";
import { resolvers } from "../graphql/resolvers";
import { types } from "../graphql/types";
import { Mutation } from "../graphql/types/mutation";
import { Query } from "../graphql/types/query";

const schemaDefinition = gql`
  schema {
    query: Query
    mutation: Mutation
  }
`;

export const graphqlInitializer = app => {
  const server = new ApolloServer({
    context: ({ ctx }) => ({ ctx }),
    introspection: config.showPlayground,
    playground: config.showPlayground,
    resolvers,
    typeDefs: [schemaDefinition, ...types, Query, Mutation],
    uploads: false,
    validationRules: [depthLimit(config.gqlDepthLimit)],
  });
  app.use(
    mount(config.gqlPath, graphqlUploadKoa({ maxFileSize: config.gqlMaxFileSize, maxFiles: config.gqlMaxFiles })),
  );
  server.applyMiddleware({ app, path: config.gqlPath, disableHealthCheck: true });
};
