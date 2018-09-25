import { getRepository } from "typeorm";
import { Card } from "entities/card";
import { logger } from "logger";

export const cardsResolver = {
  async cards() {
    logger.debug("Got request for card list");
    const repository = getRepository(Card);
    const cardList = await repository.find();
    logger.debug("Card list obtained");
    return cardList;
  },
};
