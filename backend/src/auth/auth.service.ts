import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/SignUp.dto';
import bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/SignIn.dto';
import { EncryptService } from 'src/encrypt/encrypt.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly encryptService: EncryptService
    ) {}

    async signUp(body: SignUpDto) {
        try {
            const findUser = await this.prisma.user.findUnique({
                where: {
                    email: body.email
                }
            })
            
            if (findUser) {
                throw new BadRequestException('User already exist')
            }

            const cardNumber = await this.encryptService.generateCardNumber()
            const cardHash = await this.encryptService.searchBlindIndex(cardNumber)

            if (!cardNumber || !cardHash) {
                throw new InternalServerErrorException('Failed in getting cardNumber or cardHash')
            }
            
            const hash = await bcrypt.hash(body.password, 10)
            const encryptedKeyAndCard = await this.encryptService.encryptionCardNumber(cardNumber)

            const createUser = await this.prisma.user.create({
                data: {
                    firstName: body.firstName,
                    surname: body.surname,
                    email: body.email,
                    cardEncrypted: encryptedKeyAndCard,
                    cardHash,
                    password: hash,
                    otpCode: '0000'
                }
            })
            
            return createUser
        } catch(error) {
            if (error.code === 'P2002') {
                throw new InternalServerErrorException('Failed during connect to db')
            }            
            throw new BadRequestException('Failed during SignUp')
        }
    }

    async signIn(body: SignInDto) {
        try {
            const cardShaHash = await this.encryptService.searchBlindIndex(body.card)

            const findUser = await this.prisma.user.findUnique({
                where: {
                    cardHash: cardShaHash
                }
            })


            if (!findUser || findUser.cardHash !== cardShaHash) {
                return {message: "Invalid email or card details"}   
            } 

            const passwordCompare = await bcrypt.compare(body.password, findUser.password)
            if (!passwordCompare) {
                throw new BadRequestException('passwords dont match')
            }
        
            const payload = {id: findUser.id}
            const accessToken = this.jwt.sign(payload)

            return {
                access_token: accessToken
            }
        } catch(error) {
            throw new InternalServerErrorException('Error in signIn')
        }
    }

}
