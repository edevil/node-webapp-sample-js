import { getRepository } from "typeorm";
import { Card } from "../../entities/card";

export const updateCardMutation = {
  async updateCard(obj, { id, patch }, context, info) {
    const repository = getRepository(Card);
    const card = await repository.findOne({ id });
    const result = await repository.update(id, { ...patch });
    return {
      ...card,
      ...patch,
    };
  },
};
