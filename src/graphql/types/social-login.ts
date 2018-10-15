import { gql } from "apollo-server-koa";

export const SocialLogin = gql`
  enum SocialNetwork {
    GOOGLE
    TWITTER
  }

  type SocialLogin {
    clientId: String
    type: SocialNetwork
    createdAt: String
    updatedAt: String
    user: UserProfile
  }
`;
