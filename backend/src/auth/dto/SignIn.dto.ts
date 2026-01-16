import { IsString } from "class-validator";

export class SignInDto {
    @IsString()
    cardNumber: string
    
    @IsString()
    password: string
}