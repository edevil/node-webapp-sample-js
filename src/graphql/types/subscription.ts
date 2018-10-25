import { gql } from "apollo-server-koa";

export const Subscription = gql`
  type Subscription {
    cardAdded: Card
  }
`;
