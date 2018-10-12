import { cardResolver } from "./resolvers/card";
import { cardsResolver } from "./resolvers/cards";
import { toggleCardMutation } from "./mutations/toggle-card";
import { updateCardMutation } from "./mutations/update-card";
import { createCardMutation } from "./mutations/create-card";
import { userProfileResolver } from "./resolvers/user-profile";
import { customScalarsResolver } from "./resolvers/custom-scalars";
import { examplesResolver } from "./resolvers/examples";

export const resolvers = {
  ...customScalarsResolver,
  Query: {
    ...cardsResolver,
    ...cardResolver,
    ...userProfileResolver,
    ...examplesResolver,
  },
  Mutation: {
    ...toggleCardMutation,
    ...updateCardMutation,
    ...createCardMutation,
  },
};
