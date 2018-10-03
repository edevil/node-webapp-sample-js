import { logger } from "logger";

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
  ctx.redirect(nextUrl);
}
