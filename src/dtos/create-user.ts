import { IsEmail, IsString, MinLength } from "class-validator";
import { IsEqualTo } from "../custom_validators";

export class CreateUser {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEqualTo("password", {
    message: "Password confirmation must equal password",
  })
  password_confirmation: string;
}
