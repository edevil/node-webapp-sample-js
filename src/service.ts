import { User } from "@app/entities/user";
import { CreateUser } from "@app/dtos/create-user";
import { EntityManager, Repository } from "typeorm";
import { genSaltSync, hashSync } from "bcryptjs";
import { CreateGoogleUser } from "@app/dtos/create-google-user";
import { SocialLogin, SocialType } from "@app/entities/social-login";

export async function createUser(createReq: CreateUser, repository: Repository<User>): Promise<User> {
  const salt = genSaltSync();
  const hash = hashSync(createReq.password, salt);
  const user = new User();
  user.email = createReq.email;
  user.password = hash;
  await repository.insert(user);
  return user;
}

export async function createUserFromGoogle(createReq: CreateGoogleUser, manager: EntityManager): Promise<User> {
  const user = new User();
  user.email = createReq.email;
  const socialLogin = new SocialLogin();
  socialLogin.clientId = createReq.username;
  socialLogin.type = SocialType.Google;
  user.socialLogins = [socialLogin];
  debugger;
  await manager.save(user);
  return user;
}
