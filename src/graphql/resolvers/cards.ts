import { getRepository } from "typeorm";
import { Card } from "../../entities/card";
import { logger } from "../../logger";

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
  async searchCards(obj, { searchTerm }, context, info) {
    logger.debug("Will search for cards", { searchTerm });
    const repository = getRepository(Card);
    const cardList = await repository
      .createQueryBuilder()
      .where("Card.searchVector @@ plainto_tsquery('public.pt', :searchTerm)", { searchTerm })
      .getMany();
    return cardList;
  },
};
