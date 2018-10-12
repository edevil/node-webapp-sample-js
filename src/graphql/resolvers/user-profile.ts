import { AuthenticationError } from "apollo-server-koa";
import { logger } from "../../logger";
import { getRepository } from "typeorm";
import { SocialLogin } from "../../entities/social-login";

export const userProfileResolver = {
  async userProfile(obj, args, { ctx }, info) {
    if (!ctx.isAuthenticated()) {
      throw new AuthenticationError("Must authenticate");
    }
    return ctx.state.user;
  },
};

export const extraUserProfileResolver = {
  UserProfile: {
    async socialLogins(obj, args, { ctx }, info) {
      logger.debug("Will fetch social logins");
      const repository = getRepository(SocialLogin);
      return await repository.find({ relations: ["user"], where: { user: obj } });
    },
  },
};
