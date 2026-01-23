import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class verifyViaOtpDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number

    @IsString()
    @IsNotEmpty()
    otp: string
    
}