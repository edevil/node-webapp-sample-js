import { v4 as uuid } from "uuid";

import { getRepository } from "typeorm";
import { Card } from "../../entities/card";

export const createCardMutation = {
  async createCard(obj, { card: attrs }, context, info) {
    const repository = getRepository(Card);
    const card = {
      id: uuid(),
      ...attrs,
    };
    await repository.insert(card);
    return card;
  },
};
