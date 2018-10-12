import { logger } from "../../logger";

export const examplesResolver = {
  async validAmount(obj, { num }, context, info) {
    logger.debug("Got valid num", { num });
    return num;
  },
};
