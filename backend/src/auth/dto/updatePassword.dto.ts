import { IsEmail, IsString } from "class-validator";

export class updatePasswordDto {
    @IsEmail()
    @IsString()
    email: string

    @IsString()
    password: string
}