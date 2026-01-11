import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/SignUp.dto';
import bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/SignIn.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService
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

            const hash = await bcrypt.hash(body.password, 10)

            const createUser = await this.prisma.user.create({
                data: {
                    firstName: body.firstName,
                    surname: body.surname,
                    email: body.email,
                    card: body.card,
                    password: hash
                }
            })
            
            return createUser
        } catch(error) {
            if (error.code === 'P2002') {
                throw new InternalServerErrorException('Failed during connect to db', error)
            }            
            throw new BadRequestException('Failed during SignUp')
        }
    }

    async signIn(body: any) {
        try {
            
             const findUser = await this.prisma.user.findUnique({
                where: {
                    email: body.card
                }
            })
            
            if (!findUser) {
                throw new BadRequestException('User doesnt already exist')
            }

            const payload = {id: body.id}
            const accessToken = this.jwt.sign(payload, { expiresIn: "1h"})

            return {
                access_token: accessToken
            }
        } catch(error) {
            console.log(error);
            
        }
    }

}
