import { Controller } from '@nestjs/common';
import { EncryptService } from './encrypt.service';

@Controller('encrypt')
export class EncryptController {
  constructor(private readonly encryptService: EncryptService) {}
}
