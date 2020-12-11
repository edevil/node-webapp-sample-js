const clsFactory = require("@emartech/cls-adapter");
const { compareSync } = require("bcryptjs");
const compose = require("koa-compose");
const passport = require("koa-passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { Strategy: LocalStrategy } = require("passport-local");
const { config } = require("../config");
const { logger } = require("../logger");
const { SocialLogin, SocialType } = require("../models/social-login");
const { User } = require("../models/user");
const { createUserFromGoogle } = require("../service");

function comparePass(userPassword, databasePassword) {
  return compareSync(userPassword, databasePassword);
}

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  User.query()
    .findOne("id", id)
    .then((user) => {
      if (!user) {
        logger.warn("User not found", { user_id: id });
        done(null, false);
      } else {
        done(null, user);
      }
    })
    .catch((err) => done(err, null));
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
        login = await SocialLogin.query().findOne({ clientId: googleID, type: SocialType.Google }).eager("user");
      } catch (error) {
        done(error, null);
        return;
      }

      if (!login) {
        logger.debug("User google not found", { username: googleID });
        const createReq = {
          username: googleID,
          name: profile.displayName,
          photoUrl: profile.photos[0].value,
          email: profile.emails.filter((e) => e.type === "account")[0].value,
        };
        logger.debug("google strategy", { g_user: createReq.username });

        let user;
        try {
          user = await createUserFromGoogle(createReq, SocialLogin.knex());
        } catch (error) {
          logger.error("Problems creating user", { error });
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
    clsFactory.setOnContext("user_id", ctx.state.user.id);
  }
  await next();
}

const getAuthMW = () => compose([passport.initialize(), passport.session(), setUseridCTX]);

module.exports = {
  getAuthMW,
};
