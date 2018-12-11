import { setOnContext } from "@emartech/cls-adapter";
import { compareSync } from "bcryptjs";
import * as compose from "koa-compose";
import * as passport from "koa-passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { config } from "../config";
import { CreateGoogleUser } from "../dtos/create-google-user";
import { logger } from "../logger";
import { SocialLogin, SocialType } from "../models/social-login";
import { User } from "../models/user";
import { createUserFromGoogle } from "../service";

function comparePass(userPassword, databasePassword) {
  return compareSync(userPassword, databasePassword);
}

passport.serializeUser((user: User, done) => done(null, user.id));

passport.deserializeUser((id: number, done) => {
  User.query()
    .findOne("id", id)
    .then(user => {
      if (!user) {
        logger.warn("User not found", { user_id: id });
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
      callbackURL: config.baseURL + "/auth/google/callback",
      clientID: config.googleClientId,
      clientSecret: config.googleClientSecret,
    },
    async (accessToken, refreshToken, profile, done) => {
      const googleID = profile.id;

      let login;
      try {
        login = await SocialLogin.query()
          .findOne({ clientId: googleID, type: SocialType.Google })
          .eager("user");
      } catch (error) {
        done(error, null);
        return;
      }

      if (!login) {
        logger.debug("User google not found", { username: googleID });
        const createReq = new CreateGoogleUser();
        createReq.username = googleID;
        createReq.name = profile.displayName;
        createReq.photoUrl = profile.photos[0].value;
        createReq.email = profile.emails.filter(e => e.type === "account")[0].value;
        logger.debug("google strategy", { createReq });

        let user;
        try {
          user = await createUserFromGoogle(createReq, SocialLogin.knex);
        } catch (error) {
          done(error, null);
          return;
        }
        done(null, user);
      } else {
        logger.info("Successful google auth", { username: googleID, user_id: login.user.id });
        done(null, login.user);
      }
    },
  ),
);

passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    let user;
    try {
      user = await User.query().findOne("email", email);
    } catch (error) {
      done(error, null);
      return;
    }

    if (!user) {
      logger.debug("User not found", { email });
      done(null, false);
    } else if (!user.password) {
      logger.debug("User does not have password", { email });
      done(null, false);
    } else if (!comparePass(password, user.password)) {
      logger.debug("Incorrect password", { email });
      done(null, false);
    } else {
      logger.info("Successful auth", { email, user_id: user.id });
      done(null, user);
    }
  }),
);

async function setUseridCTX(ctx, next) {
  if (ctx.isAuthenticated()) {
    setOnContext("user_id", ctx.state.user.id);
  }
  await next();
}

export const getAuthMW = () => compose([passport.initialize(), passport.session(), setUseridCTX]);
