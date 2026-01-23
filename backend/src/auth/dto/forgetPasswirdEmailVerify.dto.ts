import { IsEmail, IsString } from "class-validator";

export class forgetPasswirdEmailVerifyDto {
    @IsEmail()
    @IsString()
    email: string
}