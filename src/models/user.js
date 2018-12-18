const { Model } = require("objection");

class User extends Model {
  static get tableName() {
    return "user";
  }

  static get modelPaths() {
    return [__dirname];
  }

  static get relationMappings() {
    return {
      oauthAccessTokens: {
        join: {
          from: "user.id",
          to: "o_auth_access_token.userId",
        },
        modelClass: "oauth-access-token",
        relation: Model.HasManyRelation,
      },
      oauthAuthorizationCodes: {
        join: {
          from: "user.id",
          to: "o_auth_authorization_code.userId",
        },
        modelClass: "oauth-auth-code",
        relation: Model.HasManyRelation,
      },
      oauthClients: {
        join: {
          from: "user.id",
          to: "o_auth_client.userId",
        },
        modelClass: "oauth-client",
        relation: Model.HasManyRelation,
      },
      oauthRefreshTokens: {
        join: {
          from: "user.id",
          to: "o_auth_refresh_token.userId",
        },
        modelClass: "oauth-refresh-token",
        relation: Model.HasManyRelation,
      },
      socialLogins: {
        join: {
          from: "user.id",
          to: "social_login.userId",
        },
        modelClass: "social-login",
        relation: Model.HasManyRelation,
      },
    };
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }
}

module.exports = {
  User,
};
