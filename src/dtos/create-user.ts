import { IsEmail, IsString, MinLength } from "class-validator";
import { IsEqualTo } from "../custom_validators";

export class CreateUser {
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(8)
  public password: string;

  @IsEqualTo("password", {
    message: "Password confirmation must equal password",
  })
  public passwordConfirmation: string;
}
