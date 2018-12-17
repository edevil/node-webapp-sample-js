import { Model, RelationMappings } from "objection";
import { SocialLogin } from "./social-login";

export class User extends Model {
  public static tableName = "user";
  public static modelPaths = [__dirname];
  public static relationMappings: RelationMappings = {
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
    socialLogins: {
      join: {
        from: "user.id",
        to: "social_login.userId",
      },
      modelClass: "social-login",
      relation: Model.HasManyRelation,
    },
  };

  public id: number;
  public createdAt: Date;
  public updatedAt: Date;

  public username: string;
  public password: string;
  public email: string;
  public socialLogins: SocialLogin[];

  public $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
