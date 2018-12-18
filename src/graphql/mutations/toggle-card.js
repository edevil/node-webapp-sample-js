const { UserInputError } = require("apollo-server-koa");
const { Card } = require("../../models/card");

const toggleCardMutation = {
  async toggleCard(obj, { id }, context, info) {
    const card = await Card.query().findOne("id", id);
    if (!card) {
      throw new UserInputError("Card not found");
    }

    const done = !card.done;
    return Card.query()
      .update({ done })
      .returning("*")
      .first();
  },
};

module.exports = {
  toggleCardMutation,
};
