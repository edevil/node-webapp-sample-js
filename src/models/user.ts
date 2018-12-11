import { Model, RelationMappings } from "objection";
import { SocialLogin } from "../models/social-login";

export class User extends Model {
  public static tableName = "user";
  public static modelPaths = [__dirname];
  public static relationMappings: RelationMappings = {
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
  public createdAt: string;
  public updatedAt: string;

  public username: string;
  public password: string;
  public email: string;
  public socialLogins: SocialLogin[];

  public $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
