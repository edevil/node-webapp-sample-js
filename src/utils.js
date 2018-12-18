const jwt = require("jsonwebtoken");
const { config } = require("./config");
const { logger } = require("./logger");
const { addSuccess } = require("./messages");

async function afterLogin(ctx, user, router) {
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

function getGQLContext(user = null) {
  if (user) {
    return {
      ctx: {
        isAuthenticated() {
          return true;
        },
        i18n: {
          __(...args) {
            return args.join(" ");
          },
        },
        state: {
          user,
        },
      },
    };
  } else {
    return {
      ctx: {
        isAuthenticated() {
          return false;
        },
        i18n: {
          __(...args) {
            return args.join(" ");
          },
        },
      },
    };
  }
}

function addParamsToURL(url, params) {
  const isRelative = url.startsWith("/");
  const base = isRelative ? config.baseURL : null;

  const reducer = (tempUrl, [key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(val => tempUrl.searchParams.append(key, val));
    } else {
      tempUrl.searchParams.append(key, value);
    }
    return tempUrl;
  };

  const newUrl = [...params.entries()].reduce(reducer, new URL(url, base));
  return isRelative ? newUrl.pathname + newUrl.search : newUrl.href;
}

function generateUserToken(user) {
  return jwt.sign({ userId: user.id }, config.appKeys[0], { expiresIn: config.tokenLifetime });
}

module.exports = {
  afterLogin,
  getGQLContext,
  addParamsToURL,
  generateUserToken,
};
