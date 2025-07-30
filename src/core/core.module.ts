import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvService } from './services';
import { APP_FILTER } from '@nestjs/core';
import { PinoLogger } from 'nestjs-pino';
import { HttpExceptionFilter } from './exception-filters';

@Global() 
@Module({
  imports: [],
  providers: [
    EnvService,
    {
      provide: APP_FILTER,
      useFactory: (logger: PinoLogger) => new HttpExceptionFilter(logger),
      inject: [PinoLogger]
    }
  ],
  exports: [EnvService],
})
export class CoreModule {}