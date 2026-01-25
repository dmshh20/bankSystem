import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { transferFundsDto } from './dto/transferFunds.dto';
import { GetUser } from 'src/auth/getUser/getUser';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post('')
  async transferFunds(@Body() body: transferFundsDto, @GetUser() user: any) {
    return this.transferService.transferFunds(body, user)
  }
}
