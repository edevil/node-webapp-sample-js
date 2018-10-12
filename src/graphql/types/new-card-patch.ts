import { gql } from "apollo-server-koa";

export const NewCardPatch = gql`
  input NewCardPatch {
    title: String!
    description: String
    done: Boolean
  }
`;
