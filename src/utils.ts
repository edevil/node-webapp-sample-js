import { logger } from "./logger";
import { addSuccess } from "./messages";
import { User } from "./entities/user";

export async function afterLogin(ctx, user, router) {
  await ctx.login(user);
  let nextUrl;
  if (ctx.session.nextUrl) {
    nextUrl = ctx.session.nextUrl;
    ctx.session.nextUrl = null;
  } else {
    nextUrl = router.url("index");
  }
  logger.info("Login successful", { user_id: user.id, next_url: nextUrl });
  addSuccess(ctx, "Login successful");
  ctx.redirect(nextUrl);
}

export function getGQLContext(user: User): { ctx: any } {
  if (user) {
    return {
      ctx: {
        isAuthenticated() {
          return true;
        },
        state: {
          user
        }
      },
    };
  } else {
    return {
      ctx: {
        isAuthenticated() {
          return false;
        },
      },
    };
  }
}
