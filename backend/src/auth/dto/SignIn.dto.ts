import { IsString } from "class-validator";

export class SignInDto {
    @IsString()
    card: string
    
    @IsString()
    password: string
}