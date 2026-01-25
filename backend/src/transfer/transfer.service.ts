import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { transferFundsDto } from './dto/transferFunds.dto';
import { EncryptService } from 'src/encrypt/encrypt.service';

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
        return await this.prisma.$transaction(async (t) => {
           await this.userBalanceValidate(t, recipient, funds)
            await this.transferLogic(t, user, funds, recipient)
            this.logger.log('Transfer completed successfully')
        })
        
    }

    private async findRecipient(recipientCard: string, user: any) {
        const hashUserTransfer = await this.encryptService.createBlindIndex(recipientCard)

        const findSender = await this.prisma.user.findUnique({
            where: {id: user.id}
        })
        
         const findUserTransfer = await this.prisma.user.findUnique({
            where: { cardHash: hashUserTransfer}})

        if (!findUserTransfer || !findSender) throw new BadRequestException('User not found')
        if (findUserTransfer.id === user.id) throw new BadRequestException('Self-transfer forbidden');

        return {findSender, findUserTransfer}
    }

    private async userBalanceValidate(t: any, recipient: any, amount: number) {

         const userSenderBalance = await t.bankAccount.findUnique({
                    where: {userId: recipient.findSender.id}
            })
            if (!userSenderBalance) {
                throw new BadRequestException('Balance not found')
            }

            if (userSenderBalance?.balance < amount) {
                throw new BadRequestException('Insufficient funds')
            }
    }

    private async transferLogic(t: any, user: any, amount: number, recipient: any) {
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
                    userId: recipient.findUserTransfer.id
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
