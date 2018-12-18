const { gql } = require("apollo-server-koa");

const Mutation = gql`
  type Mutation {
    generateToken: String
    toggleCard(id: String!): Card
    updateCard(id: String!, patch: CardPatch!): Card
    createCard(card: NewCardPatch!): Card
    uploadFile(image: Upload!): Boolean
  }
`;

module.exports = {
  Mutation,
};
