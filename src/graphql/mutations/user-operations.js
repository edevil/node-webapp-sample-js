const { AuthenticationError } = require("apollo-server-koa");
const { logger } = require("../../logger");
const { generateUserToken } = require("../../utils");

const userOperationMutations = {
  async generateToken(obj, args, { ctx }, info) {
    if (!ctx.isAuthenticated()) {
      throw new AuthenticationError("Must authenticate");
    }

    logger.debug("Will generate token for user");
    return generateUserToken(ctx.state.user);
  },
};

module.exports = {
  userOperationMutations,
};
