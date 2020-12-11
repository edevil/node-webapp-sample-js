const { UserInputError } = require("apollo-server-koa");
const { Card } = require("../../models/card");

const updateCardMutation = {
  async updateCard(obj, { id, patch }, context, info) {
    const card = await Card.query().findOne("id", id);
    if (!card) {
      throw new UserInputError("Card not found");
    }

    const done = !card.done;
    return Card.query().update(patch).returning("*").first();
  },
};

module.exports = {
  updateCardMutation,
};
