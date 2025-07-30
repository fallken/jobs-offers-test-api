import { HttpException, HttpStatus } from "@nestjs/common";

export class ExternalApiSourceException extends HttpException {
    constructor(message: string, source: string, statusCode: HttpStatus) {
        super(`${source}: ${message}`, statusCode);
    }
}
