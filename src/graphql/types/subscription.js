const { gql } = require("apollo-server-koa");

const Subscription = gql`
  type Subscription {
    cardAdded: Card
  }
`;

module.exports = {
  Subscription,
};
