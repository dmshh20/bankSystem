import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class forgetPasswordEnterOtpDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    @IsString()
    otp: string
}