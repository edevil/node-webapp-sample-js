const { gql } = require("apollo-server-koa");

const PaginationAmount = gql`
  scalar PaginationAmount
`;

module.exports = {
  PaginationAmount,
};
