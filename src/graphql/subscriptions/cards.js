const { CARD_ADDED, pubsub } = require("../../initializers/graphql");

const cardsSubscription = {
  cardAdded: {
    subscribe: () => pubsub.asyncIterator([CARD_ADDED]),
  },
};

module.exports = {
  cardsSubscription,
};
