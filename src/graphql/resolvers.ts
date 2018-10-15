import { createCardMutation } from "./mutations/create-card";
import { toggleCardMutation } from "./mutations/toggle-card";
import { updateCardMutation } from "./mutations/update-card";
import { cardResolver } from "./resolvers/card";
import { cardsResolver } from "./resolvers/cards";
import { customScalarsResolver } from "./resolvers/custom-scalars";
import { examplesResolver } from "./resolvers/examples";
import { extraUserProfileResolver, userProfileResolver } from "./resolvers/user-profile";

export const resolvers = {
  ...customScalarsResolver,
  ...extraUserProfileResolver,
  Mutation: {
    ...toggleCardMutation,
    ...updateCardMutation,
    ...createCardMutation,
  },
  Query: {
    ...cardsResolver,
    ...cardResolver,
    ...userProfileResolver,
    ...examplesResolver,
  },
};
