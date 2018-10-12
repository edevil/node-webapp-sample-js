import { ApolloServer, gql } from "apollo-server-koa";
import { resolvers } from "../graphql/resolvers";
import { Query } from "../graphql/types/query";
import { types } from "../graphql/types";
import { Mutation } from "../graphql/types/mutation";
import * as depthLimit from "graphql-depth-limit";
import { config } from "../config";

const schemaDefinition = gql`
  schema {
    query: Query
    mutation: Mutation
  }
`;

export const graphqlInitializer = app => {
  const server = new ApolloServer({
    typeDefs: [schemaDefinition, ...types, Query, Mutation],
    resolvers,
    context: ({ ctx }) => ({ ctx }),
    playground: process.env.NODE_ENV !== "production",
    validationRules: [depthLimit(config.gqlDepthLimit)],
  });
  server.applyMiddleware({ app, path: config.gqlPath, disableHealthCheck: true });
};
