import { Model } from "objection";
import { v4 as uuid } from "uuid";

export class Card extends Model {
  public static tableName = "card";
  public id: string;
  public createdAt: Date;
  public updatedAt: Date;

  public title: string;
  public description: string;
  public done: boolean;
  public searchVector: string;

  public $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date();
  }

  public $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
