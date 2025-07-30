import { Module, Global } from '@nestjs/common';
import { EnvService } from './services';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exception-filters';
import { LoggerModule } from '@/logger/logger.module';
import { LoggerService } from '@/logger/services';

@Global()
@Module({
  imports: [LoggerModule],
  providers: [
    EnvService,
    {
      provide: APP_FILTER,
      useFactory: (logger: LoggerService) => new HttpExceptionFilter(logger),
      inject: [LoggerService]
    }
  ],
  exports: [EnvService],
})
export class CoreModule {}