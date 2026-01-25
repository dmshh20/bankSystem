import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { transferFundsDto } from './dto/transferFunds.dto';
import { EncryptService } from 'src/encrypt/encrypt.service';
import { GetUserDto } from 'src/auth/getUser/dto/getUser.dto';
import { transferDto } from './dto/recipient.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class TransferService {
    private readonly logger = new Logger(TransferService.name)
    
    constructor(
        private readonly prisma: PrismaService,
        private readonly encryptService: EncryptService,
    ){}

    async transferFunds(body: transferFundsDto, user: any) {
        const userTransfer = body.fullCardNumber
        const funds = Number(body.amount)

        const recipient = await this.findRecipient(userTransfer, user)
        
         this.logger.log('Making transfer...')
        return await this.prisma.$transaction(async (t: Prisma.TransactionClient) => {
           await this.userBalanceValidate(t, recipient, funds)
            await this.transferLogic(t, user, funds, recipient)
            this.logger.log('Transfer completed successfully')
        })
        
    }

    private async findRecipient(recipientCard: string, user: GetUserDto) {
        const hashUserTransfer = await this.encryptService.createBlindIndex(recipientCard)

        const sender = await this.prisma.user.findUnique({
            where: {id: user.id}
        })
        
         const recipient = await this.prisma.user.findUnique({
            where: { cardHash: hashUserTransfer}})

        if (!recipient || !sender) throw new BadRequestException('User not found')
        if (recipient.id === user.id) throw new BadRequestException('Self-transfer forbidden');

        return {sender, recipient}
    }

    private async userBalanceValidate(t: Prisma.TransactionClient, recipient: transferDto, amount: number) {

         const userSenderBalance = await t.bankAccount.findUnique({
                    where: {userId: recipient.sender.id}
            })
            if (!userSenderBalance) {
                throw new BadRequestException('Balance not found')
            }

            if (userSenderBalance?.balance < amount) {
                throw new BadRequestException('Insufficient funds')
            }
    }

    private async transferLogic(t: Prisma.TransactionClient, user: GetUserDto, amount: number, recipient: transferDto) {
        const withdrawFromSender = await t.bankAccount.update({
                where: {
                    userId: user.id
                }, data: {
                    balance: {
                        decrement: amount
                    }
                }
            })
    
            const incrementUserBalance =  await t.bankAccount.update({
                where: {
                    userId: recipient.recipient.id
                },
                 data: {
                    balance: {
                        increment: amount,
                    },
                }
            })
            return {incrementUserBalance, withdrawFromSender}        
    }
}
