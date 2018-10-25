import { CARD_ADDED, pubsub } from "../../initializers/graphql";

export const cardsSubscription = {
  cardAdded: {
    subscribe: () => pubsub.asyncIterator([CARD_ADDED]),
  },
};
