const { CARD_ADDED, pubsub } = require("../../initializers/graphql");
const { logger } = require("../../logger");
const { Card } = require("../../models/card");

const createCardMutation = {
  async createCard(obj, { card: attrs }, context, info) {
    const card = await Card.query().insert(attrs);
    pubsub
      .publish(CARD_ADDED, { cardAdded: card })
      .catch(err => logger.error("Could not publish new card message", { err }));
    return card;
  },
};

module.exports = {
  createCardMutation,
};
