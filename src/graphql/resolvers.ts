import { createCardMutation } from "./mutations/create-card";
import { exampleMutations } from "./mutations/examples";
import { toggleCardMutation } from "./mutations/toggle-card";
import { updateCardMutation } from "./mutations/update-card";
import { userOperationMutations } from "./mutations/user-operations";
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
    ...userOperationMutations,
    ...exampleMutations,
  },
  Query: {
    ...cardsResolver,
    ...cardResolver,
    ...userProfileResolver,
    ...examplesResolver,
  },
};
