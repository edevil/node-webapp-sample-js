import { gql } from "apollo-server-koa";

export const Mutation = gql`
type Mutation {
    toggleCard (
        id: String!
    ): Card

    updateCard (
        id: String!
        patch: CardPatch!
    ): Card

    createCard (
        card: NewCardPatch!
    ): Card
}
`;