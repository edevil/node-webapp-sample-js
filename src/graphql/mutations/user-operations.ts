import { AuthenticationError } from "apollo-server-koa";
import { logger } from "../../logger";
import { generateUserToken } from "../../utils";

export const UserOperationMutations = {
  async generateToken(obj, args, { ctx }, info) {
    if (!ctx.isAuthenticated()) {
      throw new AuthenticationError("Must authenticate");
    }

    logger.debug("Will generate token for user");
    return generateUserToken(ctx.state.user);
  },
};
