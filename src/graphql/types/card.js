const { gql } = require("apollo-server-koa");

const Card = gql`
  type Card {
    id: String
    title: String
    description: String
    done: Boolean
    createdAt: String
    updatedAt: String
  }
`;

module.exports = {
  Card,
};
