import { gql } from "apollo-server-koa";

// TODO add type enum

export const SocialLogin = gql`
  type SocialLogin {
    clientId: String
    created_at: String
    updated_at: String
    user: UserProfile
  }
`;
