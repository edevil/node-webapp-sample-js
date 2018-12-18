const { GraphQLInputInt } = require("graphql-input-number");
const { config } = require("../../config");

const PaginationAmount = GraphQLInputInt({
  max: config.gqlMaxPerPage,
  min: 1,
  name: "PaginationAmount",
});

const customScalarsResolver = {
  PaginationAmount,
};

module.exports = {
  customScalarsResolver,
};
