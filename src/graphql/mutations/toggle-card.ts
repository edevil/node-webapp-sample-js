import { getRepository } from "typeorm";
import { Card } from "@app/entities/card";

export const toggleCardMutation = {
  async toggleCard(obj, { id }, context, info) {
    const repository = getRepository(Card);
    const card = await repository.findOneOrFail({ id });
    const done = !card.done;
    const result = await repository.update(id, { done });
    return {
      ...card,
      done,
    };
  },
};
