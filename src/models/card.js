const { Model } = require("objection");
const { v4: uuid } = require("uuid");

class Card extends Model {
  static get tableName() {
    return "card";
  }

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date();
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }
}

module.exports = {
  Card,
};
