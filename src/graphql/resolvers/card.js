const { Card } = require("../../models/card");

const cardResolver = {
  async card(obj, { id }, context, info) {
    return Card.query().findOne("id", id);
  },
};

module.exports = {
  cardResolver,
};
