import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvService } from './services';

@Global() 
@Module({
  imports: [ConfigModule],
  providers: [EnvService],
  exports: [EnvService],
})
export class CoreModule {}