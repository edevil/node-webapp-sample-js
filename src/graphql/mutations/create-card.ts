import * as uuid from "uuid/v4";

import { getRepository } from "typeorm";
import { Card } from "@app/entities/card";

export const createCardMutation = {
  async createCard(obj, { card: attrs }, context, info) {
    const repository = getRepository(Card);
    const card = {
      id: uuid(),
      ...attrs,
    };
    await repository.save(card);
    return card;
  },
};
