import * as passport from "koa-passport";
import { User } from "@app/entities/user";
import { getRepository } from "typeorm";
import { logger } from "@app/logger";
import { Strategy as LocalStrategy } from "passport-local";
import { setOnContext } from "@emartech/cls-adapter";
import { compareSync } from "bcryptjs";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "@app/config";
import { createUserFromGoogle } from "@app/service";
import { CreateGoogleUser } from "@app/dtos/create-google-user";

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
    async (accessToken, refreshToken, profile, done) => {
      const googleID = profile.id;

      const repository = getRepository(User);
      let user;
      try {
        user = await repository.findOne({ username: googleID });
      } catch (error) {
        done(error, null);
        return;
      }

      if (!user) {
        logger.debug("User google not found", { username: googleID });
        const createReq = new CreateGoogleUser();
        createReq.username = googleID;
        createReq.name = profile.displayName;
        createReq.photoUrl = profile.photos[0].value;
        createReq.email = profile.emails.filter(e => e.type === "account")[0].value;
        logger.debug("google strategy", { createReq });

        try {
          user = await createUserFromGoogle(createReq, getRepository(User));
        } catch (error) {
          done(error, null);
          return;
        }
        done(null, user);
      } else {
        logger.info("Successful google auth", { username: googleID, user_id: user.id });
        done(null, user);
      }
    },
  ),
);

passport.use(
  new LocalStrategy({}, async (username, password, done) => {
    const repository = getRepository(User);
    let user;
    try {
      user = await repository.findOne({ username });
    } catch (error) {
      done(error, null);
      return;
    }

    if (!user) {
      logger.debug("User not found", { username });
      done(null, false);
    } else if (!comparePass(password, user.password)) {
      logger.debug("Incorrect password", { username });
      done(null, false);
    } else {
      logger.info("Successful auth", { username, user_id: user.id });
      done(null, user);
    }
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
