import { CARD_ADDED, pubsub } from "../../initializers/graphql";
import { logger } from "../../logger";
import { Card } from "../../models/card";

export const createCardMutation = {
  async createCard(obj, { card: attrs }, context, info) {
    const card = await Card.query().insert(attrs);
    pubsub
      .publish(CARD_ADDED, { cardAdded: card })
      .catch(err => logger.error("Could not publish new card message", { err }));
    return card;
  },
};
