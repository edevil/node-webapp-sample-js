const { Model } = require("objection");

class OAuthRefreshToken extends Model {
  static get tableName() {
    return "o_auth_refresh_token";
  }

  static get idColumn() {
    return "refreshToken";
  }

  static get modelPaths() {
    return [__dirname];
  }

  static get relationMappings() {
    return {
      client: {
        join: {
          from: "o_auth_refresh_token.clientId",
          to: "o_auth_client.id",
        },
        modelClass: "oauth-client",
        relation: Model.BelongsToOneRelation,
      },
      user: {
        join: {
          from: "o_auth_refresh_token.userId",
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
  OAuthRefreshToken,
};
