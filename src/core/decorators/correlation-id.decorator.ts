import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { HTTP_HEADER_CORRELATION_ID } from '../constants';

export const CorrelationId = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return req.header(HTTP_HEADER_CORRELATION_ID) ?? uuid();
});
