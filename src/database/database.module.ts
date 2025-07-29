import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvService } from '@/core';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (env: EnvService) => ({
                type: 'postgres',
                host: env.getAsString('DATABASE_HOST'),
                port: env.getAsNumber('DATABASE_PORT'),
                username: env.getAsString('DATABASE_USERNAME'),
                password: env.getAsString('DATABASE_PASSWORD'),
                database: env.getAsString('DATABASE_NAME'),
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: env.getAsBoolean('DATABASE_SYNC', false),
            }),
            inject: [EnvService],
        }),
    ],
})
export class DatabaseModule { }