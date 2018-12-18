const OAuth2Server = require("oauth2-server");
const { transaction } = require("objection");
const { OAuthAccessToken } = require("./models/oauth-access-token");
const { OAuthAuthorizationCode } = require("./models/oauth-auth-code");
const { OAuthClient } = require("./models/oauth-client");
const { OAuthRefreshToken } = require("./models/oauth-refresh-token");

const ALLOWED_GRANTS = ["authorization_code", "refresh_token"];

const model = {
  async verifyScope(token, scope) {
    if (!token.scope) {
      return false;
    }
    const requestedScopes = scope.split(" ");
    const authorizedScopes = token.scope.split(" ");
    return requestedScopes.every(s => authorizedScopes.includes(s));
  },
  async validateScope(user, client, scope) {
    if (!scope.split(" ").every(s => client.scopes.includes(s))) {
      return false;
    }
    return scope;
  },
  async getClient(clientId, clientSecret) {
    const client = await OAuthClient.query().findOne("id", clientId);

    if (!client) {
      return false;
    } else if (clientSecret && clientSecret !== client.secret) {
      return false;
    } else {
      return client;
    }
  },
  async saveToken(token, client, user) {
    const accessToken = new OAuthAccessToken();
    accessToken.accessToken = token.accessToken;
    accessToken.accessTokenExpiresAt = token.accessTokenExpiresAt;
    accessToken.scope = token.scope;
    accessToken.clientId = client.id;
    accessToken.userId = user.id;

    const refreshToken = new OAuthRefreshToken();
    refreshToken.refreshToken = token.refreshToken;
    refreshToken.refreshTokenExpiresAt = token.refreshTokenExpiresAt;
    refreshToken.scope = token.scope;
    refreshToken.clientId = client.id;
    refreshToken.userId = user.id;

    await transaction(OAuthAccessToken.knex(), async trx => {
      await OAuthAccessToken.query(trx).insert(accessToken);
      await OAuthRefreshToken.query(trx).insert(refreshToken);
    });

    return {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      client,
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      scope: token.scope,
      user,
    };
  },
  async saveAuthorizationCode(code, client, user) {
    const authCode = new OAuthAuthorizationCode();
    authCode.authorizationCode = code.authorizationCode;
    authCode.expiresAt = code.expiresAt;
    authCode.redirectUri = code.redirectUri;
    authCode.scope = code.scope;
    authCode.clientId = client.id;
    authCode.userId = user.id;

    return OAuthAuthorizationCode.query().insert(authCode);
  },
  async getAuthorizationCode(authorizationCode) {
    return OAuthAuthorizationCode.query()
      .eagerAlgorithm(OAuthAuthorizationCode.JoinEagerAlgorithm)
      .eager("[user, client]")
      .findOne("authorizationCode", authorizationCode);
  },
  async revokeToken(token) {
    const deleted = await OAuthRefreshToken.query()
      .delete()
      .where("refreshToken", token.refreshToken);
    return deleted === 1;
  },
  async revokeAuthorizationCode(code) {
    const deleted = await OAuthAuthorizationCode.query()
      .delete()
      .where("authorizationCode", code.authorizationCode);
    return deleted === 1;
  },
  async getAccessToken(accessToken) {
    return OAuthAccessToken.query()
      .eagerAlgorithm(OAuthAccessToken.JoinEagerAlgorithm)
      .eager("[user, client]")
      .findOne("accessToken", accessToken);
  },
  async getRefreshToken(refreshToken) {
    return OAuthRefreshToken.query()
      .eagerAlgorithm(OAuthRefreshToken.JoinEagerAlgorithm)
      .eager("[user, client]")
      .findOne("refreshToken", refreshToken);
  },
};

const oauth = new OAuth2Server({
  model,
});

module.exports = {
  oauth,
};
