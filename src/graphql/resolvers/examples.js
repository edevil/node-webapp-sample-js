const { logger } = require("../../logger");

const examplesResolver = {
  async validAmount(obj, { num }, context, info) {
    logger.debug("Got valid num", { num });
    return num;
  },
};

module.exports = {
  examplesResolver,
};
