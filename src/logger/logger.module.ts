import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { v4 as uuid, validate } from 'uuid';
import { EnvService } from '@/core';
import { HTTP_HEADER_CORRELATION_ID } from '@/core';

@Module({
    imports: [
        PinoLoggerModule.forRootAsync({
            inject: [EnvService],
            useFactory: async (env: EnvService) => {
                const withPrettyLogs: boolean = env.getAsBoolean('PRETTY_LOGS', true);
                const logLevel: string = env.getAsString('LOGGER_MIN_LEVEL', 'debug');

                return {
                    pinoHttp: {
                        transport: withPrettyLogs
                            ? {
                                target: 'pino-pretty',
                            }
                            : undefined,
                        level: logLevel,
                        genReqId: (request, response) => {
                            let correlationId = request.headers[HTTP_HEADER_CORRELATION_ID.toLowerCase()];

                            if (!correlationId || !validate(correlationId)) {
                                correlationId = uuid();

                                request.headers[HTTP_HEADER_CORRELATION_ID.toLowerCase()] = correlationId;
                            }

                            response.setHeader(HTTP_HEADER_CORRELATION_ID, correlationId);

                            return correlationId;
                        },
                    },
                }
            }
        }),
    ],
    exports: [],
})
export class LoggerModule { }
