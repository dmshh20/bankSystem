import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { userInfo } from 'node:os';
import { Observable } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly prisma: PrismaService
  ) {}
    private readonly logger = new Logger(LoggingInterceptor.name)

   async intercept(ctx: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = ctx.switchToHttp().getRequest()
    const response = ctx.switchToHttp().getResponse()

    const { user, url, method } = request
    const userId = user?.id


    return next
      .handle()
      .pipe(
        concatMap( async () => {
            const statusCode = response.statusCode
            const now = new Date(Date.now())


            await this.transactionsLogging(userId, statusCode, url, method, now)
          this.logger.log(`${request.method} ${request.url} StatusCode: ${request.res.statusCode}, userId: ${request.user.id}, in ${now}`)
          
        })
      );
    }
    
    private async transactionsLogging(userId: number, statusCode: number, url: string, method: string, time: Date) {
        return await this.prisma.transactionsHistory.create({
          data: {
            userId: userId,
            method: method,
            urlPath: url,
            time,
            statusCode: String(statusCode)
          }
        })
    }
}


          