import { ApiProperty } from '@nestjs/swagger';
import { JobDto } from './job.dto';

export class JobsListResponseDto {
    @ApiProperty({ type: [JobDto], description: 'List of job items' })
    jobs: Array<JobDto>;

    @ApiProperty({ description: 'Total number of items (without pagination)' })
    total: number;

    @ApiProperty()
    page: number;

    @ApiProperty({ description: 'Number of items per page' })
    pageSize: number;
} 