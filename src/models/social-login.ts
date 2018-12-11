import { Model, RelationMappings } from "objection";
import { User } from "../models/user";

export enum SocialType {
  Google,
  Twitter,
}

export class SocialLogin extends Model {
  public static tableName = "social_login";
  public static modelPaths = [__dirname];
  public static relationMappings: RelationMappings = {
    user: {
      join: {
        from: "social_login.userId",
        to: "user.id",
      },
      modelClass: "user",
      relation: Model.BelongsToOneRelation,
    },
  };

  public id: number;
  public type: SocialType;
  public user: User;
  public clientId: string;
  public createdAt: string;
  public updatedAt: string;

  public $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
