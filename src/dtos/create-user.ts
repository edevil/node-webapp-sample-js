import { IsAlphanumeric, IsString, MaxLength, MinLength } from "class-validator";
import { IsEqualTo } from "@app/custom_validators";

export class CreateUser {
  @IsString()
  @IsAlphanumeric()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEqualTo("password", {
    message: "Password confirmation must equal password",
  })
  password_confirmation: string;
}
