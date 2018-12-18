const { Model } = require("objection");

class OAuthAuthorizationCode extends Model {
  static get tableName() {
    return "o_auth_authorization_code";
  }

  static get idColumn() {
    return "authorizationCode";
  }

  static get modelPaths() {
    return [__dirname];
  }

  static get relationMappings() {
    return {
      client: {
        join: {
          from: "o_auth_authorization_code.clientId",
          to: "o_auth_client.id",
        },
        modelClass: "oauth-client",
        relation: Model.BelongsToOneRelation,
      },
      user: {
        join: {
          from: "o_auth_authorization_code.userId",
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
  OAuthAuthorizationCode,
};
