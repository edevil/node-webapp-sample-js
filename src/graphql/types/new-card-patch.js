const { gql } = require("apollo-server-koa");

const NewCardPatch = gql`
  input NewCardPatch {
    title: String!
    description: String
    done: Boolean
  }
`;

module.exports = {
  NewCardPatch,
};
