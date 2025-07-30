import { Injectable, Scope } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
    constructor(
        private readonly pinoLogger: PinoLogger
    ) { }

    info(message: any, obj = {}) {
        this.pinoLogger.info(obj, message);
    }

    warn(message: any, ...optionalParams: any[]) {
        this.pinoLogger.warn(message, optionalParams);
    }

    error(message: any, obj = {}) {
        this.pinoLogger.error(message, obj);
    }

    debug(message: any, ...optionalParams: any[]) {
        this.pinoLogger.debug(message, optionalParams);
    }

    fatal(message: any, ...optionalParams: any[]) {
        this.pinoLogger.fatal(message);
    }

    setContext(context: string) {
        this.pinoLogger.setContext(context);
    }
}