const { gql } = require("apollo-server-koa");

const Query = gql`
  type Query {
    cards: [Card]
    searchCards(searchTerm: String!): [Card]
    card(id: String!): Card
    userProfile: UserProfile
    validAmount(num: PaginationAmount!): Int
  }
`;

module.exports = {
  Query,
};
