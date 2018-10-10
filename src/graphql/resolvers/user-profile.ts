import { AuthenticationError } from "apollo-server-koa";

export const userProfileResolver = {
  async userProfile(obj, args, { ctx }, info) {
    if (!ctx.isAuthenticated()) {
      throw new AuthenticationError("Must authenticate");
    }
    return ctx.state.user;
  },
};
