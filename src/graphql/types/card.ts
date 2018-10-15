import { gql } from "apollo-server-koa";

export const Card = gql`
  type Card {
    id: String
    title: String
    description: String
    done: Boolean
    createdAt: String
    updatedAt: String
  }
`;
