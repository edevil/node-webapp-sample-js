const Joi = require("joi");

const registerSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  passwordConfirmation: Joi.string().required().valid(Joi.ref("password")),
});

module.exports = {
  registerSchema,
};
