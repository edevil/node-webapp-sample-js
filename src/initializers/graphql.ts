import { ApolloServer, gql } from "apollo-server-koa";
import { resolvers } from "graphql/resolvers";
import { Query } from "graphql/types/query";
import { types } from "graphql/types";
import { Mutation } from "graphql/types/mutation";

const path = "/graphql";

const schemaDefinition = gql`
  schema {
    query: Query
    mutation: Mutation
  }
`;

export const graphqlInitializer = app => {
  const server = new ApolloServer({ typeDefs: [schemaDefinition, ...types, Query, Mutation], resolvers });
  server.applyMiddleware({ app, path });
};
