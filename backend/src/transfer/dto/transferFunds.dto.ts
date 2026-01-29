import { IsNotEmpty, IsString } from "class-validator";

export class transferFundsDto {
    @IsString()
    @IsNotEmpty()
    fullCardNumber: string

    @IsString()
    @IsNotEmpty()
    amount: string
}