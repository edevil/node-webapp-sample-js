import { ApolloServer, gql } from "apollo-server-koa";
import { resolvers } from "@app/graphql/resolvers";
import { Query } from "@app/graphql/types/query";
import { types } from "@app/graphql/types";
import { Mutation } from "@app/graphql/types/mutation";

const path = "/graphql";

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
  });
  server.applyMiddleware({ app, path });
};
