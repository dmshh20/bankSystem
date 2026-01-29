import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/SignUp.dto';
import bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/SignIn.dto';
import { EncryptService } from 'src/encrypt/encrypt.service';
import { sendEmail } from './mailer/resend';
import { redis } from 'src/redis/redis';
import { verifyViaOtpDto } from './dto/verifyViaOtp.dto';
import { forgetPasswordEnterOtpDto } from './dto/forgetPasswordEnterOtp.dto';
import { forgetPasswirdEmailVerifyDto } from './dto/forgetPasswirdEmailVerify.dto';
import { updatePasswordDto } from './dto/updatePassword.dto';
import { GetUserDto } from './getUser/dto/getUser.dto';

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

            const createBankAccount = await this.prisma.bankAccount.create({
                data: {
                    balance: 0,
                    userId: createUser.id
                }
            })
            const {balance, ...userBankAccount} = createBankAccount 
            
            const payload = {id: createUser.id}
            const accessToken = this.jwt.sign(payload)
           
            const { password, ...UserWithoutPassword } = createUser 

            return {
                access_token: accessToken,
                user: UserWithoutPassword,
                userBankAccount
            }
        } catch(error) {
            if (error.code === 'P2002') {
                throw new InternalServerErrorException('Email already in use')
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

    async verifyViaOtp(body: verifyViaOtpDto) {
        try {
            const getActiveOtpCode = await redis.get(`otp:${body.userId}`)
            const currentUserOtp = await this.encryptService.hashOtp(body.otp)
            if (currentUserOtp !== getActiveOtpCode) {
                throw new BadRequestException('Failed verify')
            }

            const payload = {id: body.userId}
            const accessToken = this.jwt.sign(payload)

            return {
                access_token: accessToken,
                auth: true
            }
        } catch(error) {
            throw new BadRequestException('Failed verify otp')
        }
    }

    async forgetPasswordEnterOtp(body: forgetPasswordEnterOtpDto) {
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

            await redis.del(`otpPass:${findUser?.id}`)

            // return true            
             const payload = {id: findUser?.id}
            const resetToken = this.jwt.sign(payload, {expiresIn: '15m'})

            return {
                resetToken
            }
    }

    async forgetPasswordEmailVerify(body: forgetPasswirdEmailVerifyDto) {
            const findUser = await this.prisma.user.findUnique({
                where: {
                    email: body.email
                }
            })
       
            if (!findUser) {
                throw new BadRequestException('User not found')
            }

            const existingOtp = await redis.get(`otpPass:${findUser?.id}`)
            if (existingOtp) {
                return existingOtp
            }

            const generateOtpCode = await this.encryptService.otpGenerate()
            const hashGeneratedOtp = await this.encryptService.hashOtp(generateOtpCode)
            await sendEmail(String(generateOtpCode))       

            await redis.set(`otpPass:${findUser?.id}`, hashGeneratedOtp, 'EX', 300)

           
    }

    async updatePassword(body: updatePasswordDto) {
        const userNewPassword = body.password
        const hashPassword = await bcrypt.hash(userNewPassword, 10)
            
        const updateUser = await this.prisma.user.update({
            where: {
                email: body.email,
            },
            data: {
                password: hashPassword
            },
        })

        const payload = {id: updateUser?.id}
        const accessToken = this.jwt.sign(payload)
            
        return {
                access_token: accessToken
            }
    }

    async aboutUser(user: GetUserDto) {
        const existingUser = await this.prisma.user.findUnique({where: {id: user.id}})
        const existingBankAccount = await this.prisma.bankAccount.findUnique({where: {userId: existingUser?.id}})
        
        return {existingUser, existingBankAccount}
    }
}
