import { cardResolver } from "@app/graphql/resolvers/card";
import { cardsResolver } from "@app/graphql/resolvers/cards";
import { toggleCardMutation } from "@app/graphql/mutations/toggle-card";
import { updateCardMutation } from "@app/graphql/mutations/update-card";
import { createCardMutation } from "@app/graphql/mutations/create-card";

export const resolvers = {
  Query: {
    ...cardsResolver,
    ...cardResolver,
  },
  Mutation: {
    ...toggleCardMutation,
    ...updateCardMutation,
    ...createCardMutation,
  },
};
