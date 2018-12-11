import { genSaltSync, hashSync } from "bcryptjs";
import { transaction } from "objection";
import { CreateGoogleUser } from "./dtos/create-google-user";
import { CreateUser } from "./dtos/create-user";
import { SocialLogin, SocialType } from "./models/social-login";
import { User } from "./models/user";

export function createUser(createReq: CreateUser, repository): Promise<any> {
  const salt = genSaltSync();
  const hash = hashSync(createReq.password, salt);
  return repository.query().insert({ email: createReq.email, password: hash });
}

export async function createUserFromGoogle(createReq: CreateGoogleUser, knex): Promise<any> {
  return transaction(knex, async trx => {
    const user = await User.query(trx).insert({ email: createReq.email });
    await user
      .$relatedQuery<SocialLogin>("socialLogins", trx)
      .insert({ clientId: createReq.username, type: SocialType.Google })
      .returning("*");
    return user;
  });
}
