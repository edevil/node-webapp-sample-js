const { AuthenticationError } = require("apollo-server-koa");
const { logger } = require("../../logger");
const { SocialLogin, SocialType } = require("../../models/social-login");

const userProfileResolver = {
  async userProfile(obj, args, { ctx }, info) {
    if (!ctx.isAuthenticated()) {
      throw new AuthenticationError("Must authenticate");
    }
    return ctx.state.user;
  },
};

const extraUserProfileResolver = {
  SocialLogin: {
    type(obj, args, { ctx }, info) {
      const sType = obj.type;
      switch (+sType) {
        case SocialType.Google:
          return "GOOGLE";
        case SocialType.Twitter:
          return "TWITTER";
      }
    },
  },
  UserProfile: {
    async socialLogins(obj, args, { ctx }, info) {
      logger.debug("Will fetch social logins");
      return SocialLogin.query()
        .eagerAlgorithm(SocialLogin.JoinEagerAlgorithm)
        .eager("user")
        .where("userId", obj.id);
    },
  },
};

module.exports = {
  userProfileResolver,
  extraUserProfileResolver,
};
