import { ApolloServer, gql } from "apollo-server-koa";
import * as depthLimit from "graphql-depth-limit";
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
    playground: config.showPlayground,
    resolvers,
    typeDefs: [schemaDefinition, ...types, Query, Mutation],
    validationRules: [depthLimit(config.gqlDepthLimit)],
  });
  server.applyMiddleware({ app, path: config.gqlPath, disableHealthCheck: true });
};
