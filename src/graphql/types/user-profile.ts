import { gql } from "apollo-server-koa";

export const UserProfile = gql`
  type UserProfile {
    email: String
    created_at: String
    updated_at: String
  }
`;
