const { gql } = require("apollo-server-koa");

const SocialLogin = gql`
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

module.exports = {
  SocialLogin,
};
