import { cardResolver } from "@app/graphql/resolvers/card";
import { cardsResolver } from "@app/graphql/resolvers/cards";
import { toggleCardMutation } from "@app/graphql/mutations/toggle-card";
import { updateCardMutation } from "@app/graphql/mutations/update-card";
import { createCardMutation } from "@app/graphql/mutations/create-card";
import { userProfileResolver } from "@app/graphql/resolvers/user-profile";

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
