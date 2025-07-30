import { IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  password!: string;
}
