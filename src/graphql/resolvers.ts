import { cardResolver } from "./resolvers/card";
import { cardsResolver } from "./resolvers/cards";
import { toggleCardMutation } from "./mutations/toggle-card";
import { updateCardMutation } from "./mutations/update-card";
import { createCardMutation } from "./mutations/create-card";
import { userProfileResolver } from "./resolvers/user-profile";

export const resolvers = {
  Query: {
    ...cardsResolver,
    ...cardResolver,
    ...userProfileResolver,
  },
  Mutation: {
    ...toggleCardMutation,
    ...updateCardMutation,
    ...createCardMutation,
  },
};
