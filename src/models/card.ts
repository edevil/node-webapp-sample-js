import { Model } from "objection";
import { v4 as uuid } from "uuid";

export class Card extends Model {
  public static tableName = "card";
  public id: string;
  public createdAt: string;
  public updatedAt: string;

  public title: string;
  public description: string;
  public done: boolean;
  public searchVector: string;

  public $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
  }

  public $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
