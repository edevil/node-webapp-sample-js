import { Model, RelationMappings } from "objection";
import { OAuthClient } from "./oauth-client";
import { User } from "./user";

export class OauthAccessToken extends Model {
  public static tableName = "o_auth_access_token";
  public static idColumn = "accessToken";
  public static modelPaths = [__dirname];
  public static relationMappings: RelationMappings = {
    client: {
      join: {
        from: "o_auth_access_token.clientId",
        to: "o_auth_client.id",
      },
      modelClass: "user",
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

  public user: User;
  public client: OAuthClient;

  public accessToken: string;
  public scope: string;

  public accessTokenExpiresAt: Date;
  public createdAt: Date;
  public updatedAt: Date;

  public $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
