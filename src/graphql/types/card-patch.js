const { gql } = require("apollo-server-koa");

const CardPatch = gql`
  input CardPatch {
    title: String
    description: String
    done: Boolean
  }
`;

module.exports = {
  CardPatch,
};
