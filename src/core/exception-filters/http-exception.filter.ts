import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { HTTP_HEADER_CORRELATION_ID } from '../constants/http-headers.constant';
import { PinoLogger } from 'nestjs-pino';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly logger: PinoLogger) {
        this.logger.setContext(this.constructor.name)
    }

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status: HttpStatus;
        let errorMessage: string;

        const correlationId = request.header(HTTP_HEADER_CORRELATION_ID);

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            errorMessage = (exception.getResponse() as any).message || exception.message;
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            errorMessage = 'Internal server error';
            this.logger.error(`Unhandled exception: ${exception.message}`, exception.stack);
        }

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            correlationId: correlationId,
            message: errorMessage,
        };

        this.logger.debug("[HttpExceptionFilter][catch]", errorResponse)

        response.status(status).json(errorResponse);
    }
}
