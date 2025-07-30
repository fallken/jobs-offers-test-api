import { HttpException } from "@nestjs/common";

export class ExternalApiSourceException extends HttpException {
    constructor(message: string, source: string, statusCode) {
        super(`${source}: ${message}`, statusCode);
    }
}
