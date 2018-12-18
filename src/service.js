const { genSaltSync, hashSync } = require("bcryptjs");
const { transaction } = require("objection");
const { SocialType } = require("./models/social-login");
const { User } = require("./models/user");

function createUser(createReq, repository) {
  const salt = genSaltSync();
  const hash = hashSync(createReq.password, salt);
  return repository.query().insert({ email: createReq.email, password: hash });
}

async function createUserFromGoogle(createReq, knex) {
  return transaction(knex, async trx => {
    const user = await User.query(trx).insert({ email: createReq.email });
    await user
      .$relatedQuery("socialLogins", trx)
      .insert({ clientId: createReq.username, type: SocialType.Google })
      .returning("*");
    return user;
  });
}

module.exports = {
  createUser,
  createUserFromGoogle,
};
