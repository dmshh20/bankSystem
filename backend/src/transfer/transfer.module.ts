import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { EncryptModule } from 'src/encrypt/encrypt.module';
import { EncryptService } from 'src/encrypt/encrypt.service';

@Module({
  controllers: [TransferController],
  providers: [TransferService, EncryptService],
})
export class TransferModule {}
