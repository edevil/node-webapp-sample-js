const { logger } = require("../../logger");
const { Card } = require("../../models/card");

const cardsResolver = {
  async cards(obj, args, context, info) {
    logger.debug("Got request for card list");
    const cardList = await Card.query();
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
    const cardList = await Card.query().whereRaw("\"searchVector\" @@ plainto_tsquery('public.pt', ?)", [searchTerm]);
    return cardList;
  },
};

module.exports = {
  cardsResolver,
};
