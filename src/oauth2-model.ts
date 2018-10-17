import * as OAuth2Server from "oauth2-server";
import { getConnection, getRepository } from "typeorm";
import { OAuthAccessToken } from "./entities/oauth-access-token";
import { OAuthClient } from "./entities/oauth-client";
import { OAuthRefreshToken } from "./entities/oauth-refresh-token";
import { User } from "./entities/user";

const ALLOWED_GRANTS = ["authorization_code", "refresh_token"];

const model: OAuth2Server.AuthorizationCodeModel & OAuth2Server.RefreshTokenModel = {
  async getClient(clientId, clientSecret) {
    const repository = getRepository(OAuthClient);
    const client = await repository.findOne(clientId);

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
    accessToken.scope = token.scope as string;
    accessToken.client = client as OAuthClient;
    accessToken.user = user as User;

    const refreshToken = new OAuthRefreshToken();
    refreshToken.refreshToken = token.refreshToken;
    refreshToken.refreshTokenExpiresAt = token.refreshTokenExpiresAt;
    refreshToken.scope = token.scope as string;
    refreshToken.client = client as OAuthClient;
    refreshToken.user = user as User;

    await getConnection().manager.transaction(async transactionalEntityManager => {
      await transactionalEntityManager.save(accessToken);
      await transactionalEntityManager.save(refreshToken);
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
};

const options: OAuth2Server.ServerOptions = {
  model,
};

export const oauth = new OAuth2Server(options);
