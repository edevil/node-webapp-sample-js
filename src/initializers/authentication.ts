import * as passport from "koa-passport";
import { User } from "entities/user";
import { getRepository } from "typeorm";
import { logger } from "logger";
import { Strategy as LocalStrategy } from "passport-local";
import { setOnContext } from "@emartech/cls-adapter";

passport.serializeUser((user: User, done) => done(null, user.id));

passport.deserializeUser((id: number, done) => {
  const repository = getRepository(User);
  repository
    .findOne({ id })
    .then(user => {
      if (!user) {
        logger.warning("User not found", { userId: id });
        done(null, false);
      } else {
        done(null, user);
      }
    })
    .catch(err => done(err, null));
});

passport.use(
  new LocalStrategy({}, (username, password, done) => {
    const repository = getRepository(User);
    repository
      .findOne({ username })
      .then(user => {
        if (!user) {
          done(null, false);
        } else if (password !== user.password) {
          done(null, false);
        } else {
          done(null, user);
        }
      })
      .catch(err => done(err, null));
  }),
);

export const authInitializer = app => {
  app
    .use(passport.initialize())
    .use(passport.session())
    .use(async (ctx, next) => {
      if (ctx.isAuthenticated()) {
        setOnContext("user_id", ctx.state.user.id);
      }
      await next();
    });
};
