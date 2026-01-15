import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { createCipheriv, createHash, randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';
import { randomInt } from 'node:crypto';
import { createDecipheriv } from 'node:crypto';


@Injectable()
export class EncryptService {
    private async getKey() {
            const password = process.env.ENCRYPT_PASSWORD as string
            const salt = process.env.SALT as string
            return (await promisify(scrypt)(password, salt, 32)) as Buffer;
    }

    private readonly logger = new Logger(EncryptService.name);

    async encryptionCardNumber(cardNumber: string) {
        try {
            const iv = randomBytes(16);
            
            const key = await this.getKey()
            const cipher = createCipheriv('aes-256-ctr', key, iv);

            const textToEncrypt = cardNumber;
            const encryptedText = Buffer.concat([
                cipher.update(textToEncrypt),
                cipher.final(),
            ]);

            return iv.toString('hex') + ':' + encryptedText.toString('hex')
        } catch(error) {
            this.logger.error(`Encryption failed: ${error.message}`);
            throw new InternalServerErrorException('Failed encryption card')
        }
    }

    async generateCardNumber() {
        try {

            let cardNumber = '21'
            for (let i = 1; i <= 14; i++) {
                cardNumber += randomInt(0, 10).toString()
            }

            return cardNumber
        } catch(error) {
            throw new InternalServerErrorException('Failed in generation cardNumber')
            
        }
    }

    async decryptCardNumber(combineData: string) {
        try {
            const [cardKey, cardNumber] = combineData.split(':')

            if (!cardKey || !cardNumber) {
                throw new BadRequestException('Invalid data')
            }

            const iv = Buffer.from(cardKey, 'hex')
            const encryptedText = Buffer.from(cardNumber, 'hex')

            const key = await this.getKey()
            
            const decipher = createDecipheriv('aes-256-ctr', key, iv);
            const decryptedText = Buffer.concat([
                decipher.update(encryptedText),
                decipher.final(),
            ])
        
            
             return decryptedText.toString()
        } catch(error){
            this.logger.error(`Decryption failed: ${error.message}`);
            throw new InternalServerErrorException('Failed decrypting card')
            
        }
    }


    async createBlindIndex(cardNumber: string) {
        try {
            return createHash('sha256').update(cardNumber + process.env.PEPPER).digest('hex')
        } catch(error) {
            throw new InternalServerErrorException('Error in finding BlindIndex')   
        }
    }
    
    async otpGenerate() {
        return randomInt(100000, 999999).toString()
    }

    async hashOtp(code: string) {
        try {
            return createHash('sha256').update(code + process.env.PEPPER).digest('hex')
        } catch(error) {
            throw new InternalServerErrorException('Error in finding BlindIndex')   
        }
    }

}
