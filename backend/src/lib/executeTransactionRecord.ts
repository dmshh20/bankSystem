import { Decimal } from "@prisma/client/runtime/index-browser"
import { Prisma } from "generated/prisma/client"
import { transferDto } from "src/transfer/dto/recipient.dto"

export const executeTransactionRecord = async (t: Prisma.TransactionClient, sender: number, recipient: transferDto, amount: Decimal, status) => {
    console.log(amount)
    
     return await t.transactionsHistory.create({
            data: {
                senderId: sender,
                receiverId: recipient.recipient.id,
                amount,
                currency: 'UAH',
                status
            }
        })
}