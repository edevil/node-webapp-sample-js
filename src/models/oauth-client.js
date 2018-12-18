const { Model } = require("objection");

class OAuthClient extends Model {
  static get tableName() {
    return "o_auth_client";
  }

  static get modelPaths() {
    return [__dirname];
  }

  static get relationMappings() {
    return {
      oauthAccessTokens: {
        join: {
          from: "o_auth_client.id",
          to: "o_auth_access_token.clientId",
        },
        modelClass: "oauth-access-token",
        relation: Model.HasManyRelation,
      },
      oauthAuthorizationCodes: {
        join: {
          from: "o_auth_client.id",
          to: "o_auth_authorization_code.clientId",
        },
        modelClass: "oauth-auth-code",
        relation: Model.HasManyRelation,
      },
      oauthRefreshTokens: {
        join: {
          from: "o_auth_client.id",
          to: "o_auth_refresh_token.clientId",
        },
        modelClass: "oauth-refresh-token",
        relation: Model.HasManyRelation,
      },
      user: {
        join: {
          from: "o_auth_client.userId",
          to: "user.id",
        },
        modelClass: "user",
        relation: Model.BelongsToOneRelation,
      },
    };
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }
}

module.exports = {
  OAuthClient,
};
