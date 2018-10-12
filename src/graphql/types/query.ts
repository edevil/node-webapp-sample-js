import { gql } from "apollo-server-koa";

export const Query = gql`
  type Query {
    cards: [Card]
    card(id: String!): Card
    userProfile: UserProfile
    validAmount(num: PaginationAmount!): Int
  }
`;
