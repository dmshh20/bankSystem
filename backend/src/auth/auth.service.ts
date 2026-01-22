import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/SignUp.dto';
import bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/SignIn.dto';
import { EncryptService } from 'src/encrypt/encrypt.service';
import { sendEmail } from './mailer/resend';
import { redis } from 'src/redis/redis';

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
            const cardHash = await this.encryptService.createBlindIndex(cardNumber)
            console.log(cardNumber)
        
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
                }
            })
            
            const payload = {id: createUser.id}
            const accessToken = this.jwt.sign(payload)
           
            return {
                access_token: accessToken,
                user: createUser
            }
        } catch(error) {
            if (error.code === 'P2002') {
                throw new InternalServerErrorException('Failed during connect to db')
            }            
            throw new BadRequestException('Failed during SignUp')
        }
    }

    async signIn(body: SignInDto) {
        try {
            const cardShaHash = await this.encryptService.createBlindIndex(body.cardNumber)

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
        
            const generateOtpCode = await this.encryptService.otpGenerate()
            const hashOtpCode = await this.encryptService.hashOtp(generateOtpCode)
            
          
            await sendEmail(String(generateOtpCode))
            await redis.set(`otp:${findUser.id}`, hashOtpCode, 'EX', 300)
            
            return {
                validate: true,
                userId: findUser.id
            }
        } catch(error) {            
            throw new InternalServerErrorException('Error in signIn')
        }
    }

    async verifyViaOtp(body: {userId: number, otp: string}) {
        try {
            const getActiveOtpCode = await redis.get(`otp:${body.userId}`)
            const currentUserOtp = await this.encryptService.hashOtp(body.otp)
            if (currentUserOtp !== getActiveOtpCode) {
                throw new BadRequestException('Failed verify')
            }

            const payload = {id: body.userId}
            const accessToken = this.jwt.sign(payload)

            await redis.del(`otp:${body.userId}`) // if there will be an error here, its due to this code
            return {
                access_token: accessToken,
                auth: true
            }
        } catch(error) {
            throw new BadRequestException('Failed verify otp')
        }
    }

    async forgetPasswordOtpVerify(body: {email: string, otp: string}) {
            const findUser = await this.prisma.user.findUnique({
                where: {
                    email: body.email
                }
            })

            if (!findUser) {
                throw new BadRequestException('User not found')
            } 

            const hashCurrentUserotp = await this.encryptService.hashOtp(body.otp)
            const getUserOtp = await redis.get(`otpPass:${findUser?.id}`)

            if (hashCurrentUserotp !== getUserOtp) {
                throw new BadRequestException('Invalid otp')
            } 

            const payload = {id: findUser?.id}
            const accessToken = this.jwt.sign(payload)
           
            await redis.del(`otpPass:${findUser?.id}`)
            return {
                access_token: accessToken
            }
    }

    async emailVerify(body: {email: string}) {
            const findUser = await this.prisma.user.findUnique({
                where: {
                    email: body.email
                }
            })
       
            const existingOtp = await redis.get(`otpPass:${findUser?.id}`)
            if (existingOtp) {
                return existingOtp
            }

            const generateOtpCode = await this.encryptService.otpGenerate()
            const hashGeneratedOtp = await this.encryptService.hashOtp(generateOtpCode)
            await sendEmail(String(generateOtpCode))       

            await redis.set(`otpPass:${findUser?.id}`, hashGeneratedOtp, 'EX', 300)
    }

}
