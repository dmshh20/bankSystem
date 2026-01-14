import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { EncryptModule } from './encrypt/encrypt.module';

@Module({
  imports: [AuthModule,
     PrismaModule,
     ConfigModule.forRoot({
      isGlobal: true
     }),
     EncryptModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
