import { ApiProperty } from '@nestjs/swagger';

export class ErrorBadRequestResponseDto {
    @ApiProperty({ example: 400, description: 'The HTTP status code' })
    statusCode: number;

    @ApiProperty({ example: '2025-07-30T10:31:40.114Z', description: 'The timestamp of the error' })
    timestamp: string;

    @ApiProperty({
        example: '/api/job-offers?page=1&pageSize=30',
        description: 'The path of the request',
    })
    path: string;

    @ApiProperty({ example: 'f7fd7681-6dfe-45f5-9680-0d60b4afae0a', description: 'The correlation ID - type uuid' })
    correlationId: string;

    @ApiProperty({
        description: 'The error message(s)',
        oneOf: [
            { type: 'string', example: 'Minimum salary must not be greater than Maximum salary' },
            {
                type: 'array',
                items: { type: 'string' },
                example: [
                    'Minimum salary must not be greater than Maximum salary',
                    'Maximum salary must not be less than Minimum salary',
                ],
            },
        ],
    })
    message: string | string[];
}
