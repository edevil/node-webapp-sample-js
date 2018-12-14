import { Model, RelationMappings } from "objection";
import { User } from "./user";

export class OAuthClient extends Model {
  public static tableName = "o_auth_client";
  public static modelPaths = [__dirname];
  public static relationMappings: RelationMappings = {
    user: {
      join: {
        from: "o_auth_client.userId",
        to: "user.id",
      },
      modelClass: "user",
      relation: Model.BelongsToOneRelation,
    },
  };

  public id: number;
  public user: User;
  public secret: string;
  public grants: string[];
  public scopes: string[];
  public redirectUris: string[];
  public createdAt: Date;
  public updatedAt: Date;

  public $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
