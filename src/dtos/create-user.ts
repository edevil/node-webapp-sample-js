import { IsAlphanumeric, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUser {
  @IsString()
  @IsAlphanumeric()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;
}
