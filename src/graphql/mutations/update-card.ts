import { UserInputError } from "apollo-server-koa";
import { Card } from "../../models/card";

export const updateCardMutation = {
  async updateCard(obj, { id, patch }, context, info) {
    const card = await Card.query().findOne("id", id);
    if (!card) {
      throw new UserInputError("Card not found");
    }

    const done = !card.done;
    return Card.query()
      .update(patch)
      .returning("*")
      .first();
  },
};
