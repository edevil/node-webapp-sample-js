const { Model } = require("objection");

class OAuthAccessToken extends Model {
  static get tableName() {
    return "o_auth_access_token";
  }

  static get idColumn() {
    return "accessToken";
  }

  static get modelPaths() {
    return [__dirname];
  }

  static get relationMappings() {
    return {
      client: {
        join: {
          from: "o_auth_access_token.clientId",
          to: "o_auth_client.id",
        },
        modelClass: "oauth-client",
        relation: Model.BelongsToOneRelation,
      },
      user: {
        join: {
          from: "o_auth_access_token.userId",
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
  OAuthAccessToken,
};
