import { gql } from "apollo-server-koa";

export const SocialLogin = gql`
  enum SocialNetwork {
    GOOGLE
    TWITTER
  }

  type SocialLogin {
    clientId: String
    type: SocialNetwork
    created_at: String
    updated_at: String
    user: UserProfile
  }
`;
