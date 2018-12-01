import { Card } from "../../models/card";

export const cardResolver = {
  async card(obj, { id }, context, info) {
    return Card.query().findOne("id", id);
  },
};
