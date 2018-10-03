import * as passport from "koa-passport";
import { User } from "entities/user";
import { getRepository } from "typeorm";
import { logger } from "logger";
import { Strategy as LocalStrategy } from "passport-local";
import { setOnContext } from "@emartech/cls-adapter";
import { compareSync } from "bcryptjs";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "config";

function comparePass(userPassword, databasePassword) {
  return compareSync(userPassword, databasePassword);
}

passport.serializeUser((user: User, done) => done(null, user.id));

passport.deserializeUser((id: number, done) => {
  const repository = getRepository(User);
  repository
    .findOne({ id })
    .then(user => {
      if (!user) {
        logger.warning("User not found", { user_id: id });
        done(null, false);
      } else {
        done(null, user);
      }
    })
    .catch(err => done(err, null));
});

passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleClientId,
      clientSecret: config.googleClientSecret,
      callbackURL: config.baseURL + "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      logger.debug("google strategy", { accessToken, refreshToken, profile: JSON.stringify(profile) });
    },
  ),
);

passport.use(
  new LocalStrategy({}, (username, password, done) => {
    const repository = getRepository(User);
    repository
      .findOne({ username })
      .then(user => {
        if (!user) {
          logger.debug("User not found", { username: username });
          done(null, false);
        } else if (!comparePass(password, user.password)) {
          logger.debug("Incorrect password", { username: username });
          done(null, false);
        } else {
          logger.info("Successful auth", { username: username });
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
