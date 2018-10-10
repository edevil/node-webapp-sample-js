import { getRepository } from "typeorm";
import { Card } from "@app/entities/card";
import { logger } from "@app/logger";

export const cardsResolver = {
  async cards(obj, args, context, info) {
    logger.debug("Got request for card list");
    const repository = getRepository(Card);
    const cardList = await repository.find();
    logger.debug("Card list obtained");
    if (context.ctx.isAuthenticated()) {
      logger.debug("Authenticated request");
    } else {
      logger.debug("Request not authenticated");
    }
    return cardList;
  },
};
