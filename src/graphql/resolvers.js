const { createCardMutation } = require("./mutations/create-card");
const { exampleMutations } = require("./mutations/examples");
const { toggleCardMutation } = require("./mutations/toggle-card");
const { updateCardMutation } = require("./mutations/update-card");
const { userOperationMutations } = require("./mutations/user-operations");
const { cardResolver } = require("./resolvers/card");
const { cardsResolver } = require("./resolvers/cards");
const { customScalarsResolver } = require("./resolvers/custom-scalars");
const { examplesResolver } = require("./resolvers/examples");
const { extraUserProfileResolver, userProfileResolver } = require("./resolvers/user-profile");
const { cardsSubscription } = require("./subscriptions/cards");

const resolvers = {
  ...customScalarsResolver,
  ...extraUserProfileResolver,
  Mutation: {
    ...toggleCardMutation,
    ...updateCardMutation,
    ...createCardMutation,
    ...userOperationMutations,
    ...exampleMutations,
  },
  Query: {
    ...cardsResolver,
    ...cardResolver,
    ...userProfileResolver,
    ...examplesResolver,
  },
  Subscription: {
    ...cardsSubscription,
  },
};

module.exports = {
  resolvers,
};
