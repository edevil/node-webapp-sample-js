const { gql } = require("apollo-server-koa");

const UserProfile = gql`
  type UserProfile {
    email: String
    createdAt: String
    updatedAt: String
    socialLogins: [SocialLogin]
  }
`;

module.exports = {
  UserProfile,
};
