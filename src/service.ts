import { User } from "entities/user";
import { CreateUser } from "dtos/create-user";
import { Repository } from "typeorm";

export async function createUser(createReq: CreateUser, repository: Repository<User>): Promise<User> {
  const user = new User();
  user.username = createReq.username;
  user.password = createReq.password;
  await repository.insert(user);
  return user
}
