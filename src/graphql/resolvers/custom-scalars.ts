import { GraphQLInputInt } from "graphql-input-number";
import { config } from "../../config";

const PaginationAmount = GraphQLInputInt({
  max: config.gqlMaxPerPage,
  min: 1,
  name: "PaginationAmount",
});

export const customScalarsResolver = {
  PaginationAmount,
};
