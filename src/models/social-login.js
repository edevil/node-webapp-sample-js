const { Model } = require("objection");

const SocialType = {
  Google: "GOOGLE",
  Twitter: "TWITTER",
};

class SocialLogin extends Model {
  static get tableName() {
    return "social_login";
  }

  static get idColumn() {
    return ["type", "userId"];
  }

  static get modelPaths() {
    return [__dirname];
  }

  static get relationMappings() {
    return {
      user: {
        join: {
          from: "social_login.userId",
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
  SocialLogin,
  SocialType,
};
