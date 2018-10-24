import { GraphQLInputInt } from "graphql-input-number";
import { GraphQLUpload } from "graphql-upload";
import { config } from "../../config";

const PaginationAmount = GraphQLInputInt({
  max: config.gqlMaxPerPage,
  min: 1,
  name: "PaginationAmount",
});

const Upload = GraphQLUpload;

export const customScalarsResolver = {
  PaginationAmount,
  Upload,
};
