import { gql } from "apollo-server-koa";

export const UserProfile = gql`
  type UserProfile {
    email: String
    createdAt: String
    updatedAt: String
    socialLogins: [SocialLogin]
  }
`;
