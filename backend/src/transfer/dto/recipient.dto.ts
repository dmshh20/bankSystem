import { IsNumber, IsString } from "class-validator"

export class GeneralDto {
    @IsNumber()
    id: number

    @IsString()
    firstName: string

    @IsString()
    surname: string

    @IsString()
    email: string
}

export class transferDto {
    sender: GeneralDto
    recipient: GeneralDto
}
