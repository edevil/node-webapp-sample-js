import { GraphQLInputInt } from "graphql-input-number";
import { config } from "../../config";

const PaginationAmount = GraphQLInputInt({
  name: "PaginationAmount",
  min: 1,
  max: config.gqlMaxPerPage,
});

export const customScalarsResolver = {
  PaginationAmount,
};
