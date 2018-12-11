import { AuthenticationError } from "apollo-server-koa";
import { logger } from "../../logger";
import { SocialLogin, SocialType } from "../../models/social-login";

export const userProfileResolver = {
  async userProfile(obj, args, { ctx }, info) {
    if (!ctx.isAuthenticated()) {
      throw new AuthenticationError("Must authenticate");
    }
    return ctx.state.user;
  },
};

export const extraUserProfileResolver = {
  SocialLogin: {
    type(obj, args, { ctx }, info) {
      const sType: SocialType = obj.type;
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
