const Joi = require("joi");
const { registerSchema } = require("./validation_schemas");
const asyncBusboy = require("async-busboy");
const fs = require("fs");
const bodyParser = require("koa-bodyparser");
const CSRF = require("koa-csrf");
const passport = require("koa-passport");
const Router = require("koa-router");
const { AccessDeniedError, Request, Response, UnauthorizedRequestError } = require("oauth2-server");
const { logger } = require("./logger");
const { addError, addWarning } = require("./messages");
const { getMessagesMW } = require("./middleware/fetch-messages");
const { getLoggedInMW, getLoginReqMW } = require("./middleware/redirect-logged");
const { OAuthClient } = require("./models/oauth-client");
const { User } = require("./models/user");
const { oauth } = require("./oauth2-model");
const { loginRLMW } = require("./rate-limits");
const { createUser } = require("./service");
const { addParamsToURL, afterLogin } = require("./utils");

const router = new Router();

const redLoggedMW = getLoggedInMW(router, "index");
const redLoginReqMW = getLoginReqMW(router, "auth-login");
const CSRFMW = new CSRF({
  disableQuery: false,
  excludedMethods: ["GET", "HEAD", "OPTIONS"],
  invalidSessionSecretMessage: "Invalid session secret",
  invalidSessionSecretStatusCode: 403,
  invalidTokenMessage: "Invalid CSRF token",
  invalidTokenStatusCode: 403,
});

router.use(bodyParser());

router.use(getMessagesMW());

router.get("index", "/", async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    logger.debug("Authenticated request");
  } else {
    logger.debug("No authentication");
  }
  logger.debug("Locale", {
    cookie: ctx.getLocaleFromCookie(),
    header: ctx.getLocaleFromHeader(),
  });
  logger.debug("Translate", { result: ctx.i18n.__("test key") });

  await ctx.render("index", { authenticated: ctx.isAuthenticated() });
});

router.get("chat", "/chat", async (ctx, next) => {
  await ctx.render("chat", { authenticated: ctx.isAuthenticated() });
});

router.get("oauth-authorize", "/oauth/authorize", CSRFMW, redLoginReqMW, async (ctx, next) => {
  const clientId = ctx.request.query.client_id;
  const client = clientId ? await OAuthClient.query().findOne("id", clientId) : null;
  if (!client) {
    addWarning(ctx, ctx.i18n.__("oauth_error_no_client"));
    ctx.redirect(router.url("index"));
    return;
  }

  const allowedQParams = new Set(["scope", "redirect_uri", "response_type", "client_id", "access_type"]);
  const filteredEntries = Object.entries(ctx.request.query).filter(([key, val]) => allowedQParams.has(key));
  const paramMap = new Map(filteredEntries);
  const authorizeUrl = addParamsToURL(router.url("oauth-authorize-post"), paramMap);

  await ctx.render("oauth-authorize", {
    authorizeUrl,
    client,
    csrf: ctx.csrf,
  });
});

router.post("oauth-authorize-post", "/oauth/authorize", CSRFMW, redLoginReqMW, async (ctx, next) => {
  const oauthRequest = new Request(ctx.request);
  const oauthResponse = new Response(ctx.response);

  // ugly hack because the oauth module only fetches this from the query
  // https://github.com/oauthjs/node-oauth2-server/pull/532
  oauthRequest.query.allowed = ctx.request.body.allowed;

  try {
    await oauth.authorize(oauthRequest, oauthResponse, {
      allowEmptyState: true,
      authenticateHandler: { handle: (req, resp) => ctx.state.user },
    });
  } catch (err) {
    logger.warn(`Could not authorize OAuth`, { err });
    if (err instanceof AccessDeniedError) {
      addWarning(ctx, ctx.i18n.__("oauth_error_no_client_authorization"));
      ctx.redirect(router.url("index"));
      return;
    }

    ctx.set(oauthResponse.headers);
    ctx.status = err.code;
    if (err instanceof UnauthorizedRequestError) {
      ctx.body = { error: err.name, error_description: err.message };
    }
    return;
  }

  ctx.set(oauthResponse.headers);
  ctx.status = oauthResponse.status;
  ctx.body = oauthResponse.body;
});

router.post("oauth-token-post", "/oauth/token", async (ctx, next) => {
  const oauthRequest = new Request(ctx.request);
  const oauthResponse = new Response(ctx.response);

  try {
    await oauth.token(oauthRequest, oauthResponse);
  } catch (err) {
    logger.warn(`Could not validate token`, { err });
    ctx.set(oauthResponse.headers);
    ctx.status = err.code;
    if (err instanceof UnauthorizedRequestError) {
      ctx.body = { error: err.name, error_description: err.message };
    }
    return;
  }

  ctx.set(oauthResponse.headers);
  ctx.status = oauthResponse.status;
  ctx.body = oauthResponse.body;
});

router.get("oauth-request-test", "/oauthtest", async (ctx, next) => {
  const oauthRequest = new Request(ctx.request);
  const oauthResponse = new Response(ctx.response);

  let token;
  try {
    token = await oauth.authenticate(oauthRequest, oauthResponse);
  } catch (err) {
    logger.warn(`Could not authenticate OAuth`, { err });
    ctx.set(oauthResponse.headers);
    ctx.status = err.code;
    return;
  }
  ctx.body = { user: token.user.id };
});

router.get("auth-logout", "/auth/logout", CSRFMW, redLoginReqMW, async (ctx, next) => {
  await ctx.render("logout", {
    csrf: ctx.csrf,
    logoutUrl: router.url("auth-logout-post"),
  });
});

router.post("auth-logout-post", "/auth/logout", CSRFMW, async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    logger.info("Logging out");
    ctx.logout();
  } else {
    logger.debug("Logout with no auth");
  }

  ctx.redirect(router.url("index"));
});

router.get("auth-login-google", "/auth/google", redLoggedMW, async (ctx, next) => {
  return passport.authenticate("google", { scope: ["profile", "email"] })(ctx, next);
});

router.get("auth-login-google-callback", "/auth/google/callback", redLoggedMW, async (ctx, next) => {
  const loginCallback = async (err, user, info, status) => {
    if (user) {
      await afterLogin(ctx, user, router);
    } else {
      logger.info("Could not login user", { err: JSON.stringify(err), info, status });
      ctx.redirect(router.url("index"));
    }
  };

  return passport.authenticate("google", loginCallback)(ctx, next);
});

router.get("auth-login", "/auth/login", CSRFMW, redLoggedMW, async (ctx, next) => {
  await ctx.render("login", {
    csrf: ctx.csrf,
    loginUrl: router.url("auth-login-post"),
  });
});

router.post("auth-login-post", "/auth/login", CSRFMW, loginRLMW, redLoggedMW, async (ctx, next) => {
  const loginCallback = async (err, user, info, status) => {
    if (user) {
      await afterLogin(ctx, user, router);
    } else {
      logger.info("Could not login user", { err, info, status });
      await ctx.render("login", {
        csrf: ctx.csrf,
        loginUrl: router.url("auth-login-post"),
      });
    }
  };

  return passport.authenticate("local", loginCallback)(ctx, next);
});

router.get("auth-register", "/auth/register", CSRFMW, redLoggedMW, async (ctx, next) => {
  await ctx.render("register", {
    csrf: ctx.csrf,
    registerUrl: router.url("auth-register-post"),
  });
});

router.post("auth-register-post", "/auth/register", CSRFMW, redLoggedMW, async (ctx, next) => {
  let createReq = Joi.validate(ctx.request.body, registerSchema, { stripUnknown: true });
  if (createReq.error) {
    logger.error(JSON.stringify(createReq.error));
    addError(ctx, ctx.i18n.__("error-create-user"));
    await ctx.render("register", {
      csrf: ctx.csrf,
      error: createReq.error,
      registerUrl: router.url("auth-register-post"),
    });
    return;
  }

  let user;
  try {
    user = await createUser(createReq.value, User);
  } catch (error) {
    if (error.message.includes("duplicate key value violates unique constraint")) {
      logger.debug("User already registered", { email: createReq.value.email });
      await ctx.render("register", {
        csrf: ctx.csrf,
        error,
        registerUrl: router.url("auth-register-post"),
      });
      return;
    } else {
      throw error;
    }
  }
  logger.info("New user created", { userId: user.id });
  await afterLogin(ctx, user, router);
});

router.post("upload-test", "/upload", async (ctx, next) => {
  // Upload experiment. In real scenarios stream to a cloud storage solution
  const { files, fields } = await asyncBusboy(ctx.req, { limits: { files: 1, fileSize: 1000000 } });
  logger.debug(`Fields: ${JSON.stringify(fields)}, files: ${JSON.stringify(files)}`);
  if (files[0]) {
    logger.debug("Will save file", { path: files[0].path });
    const myFile = fs.createWriteStream("output");
    const promise = new Promise((resolve, reject) => {
      files[0]
        .on("error", (err) => {
          logger.info("Could not read file", { err });
          myFile.close();
          reject(err);
        })
        .on("end", () => {
          logger.debug("Only finished now");
          resolve();
        })
        .pipe(myFile);
      fs.unlinkSync(files[0].path);
    });
    await promise;
  }

  ctx.body = "all done";
});

module.exports = {
  router,
};
