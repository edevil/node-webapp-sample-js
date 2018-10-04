import { User } from "@app/entities/user";
import { CreateUser } from "@app/dtos/create-user";
import { Repository } from "typeorm";
import { genSaltSync, hashSync } from "bcryptjs";
import { CreateGoogleUser } from "@app/dtos/create-google-user";

export async function createUser(createReq: CreateUser, repository: Repository<User>): Promise<User> {
  const salt = genSaltSync();
  const hash = hashSync(createReq.password, salt);
  const user = new User();
  user.username = createReq.username;
  user.password = hash;
  await repository.insert(user);
  return user;
}

export async function createUserFromGoogle(createReq: CreateGoogleUser, repository: Repository<User>): Promise<User> {
  const user = new User();
  user.username = createReq.username;
  await repository.insert(user);
  return user;
}
