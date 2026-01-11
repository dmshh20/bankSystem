import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    firstName: string

    @IsString()
    @IsNotEmpty()
    surname: string

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    card: string

    @IsString()
    @IsNotEmpty()
    password: string
}