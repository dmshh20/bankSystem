import { Controller, Get, UseGuards } from '@nestjs/common';
import { EncryptService } from './encrypt.service';
import { GetUser } from 'src/auth/getUser/getUser';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { GetUserDto } from 'src/auth/getUser/dto/getUser.dto';

@UseGuards(JwtAuthGuard)
@Controller('encrypt')
export class EncryptController {
  constructor(private readonly encryptService: EncryptService) {}

  @Get('/decryptCard')
  async decryptCard(@GetUser() user: GetUserDto) {
    return this.encryptService.decryptCard(user)
  }

}
