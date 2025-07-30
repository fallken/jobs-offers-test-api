import { ApiProperty } from '@nestjs/swagger';
import { JobDto } from './job.dto';

export class JobsListResponseDto {
    @ApiProperty({
        type: [JobDto], description: 'List of job items', example: [
            {
                "createdAt": "2025-07-30T07:54:50.323Z",
                "id": 249,
                "jobId": "P1-141",
                "position": "Data Scientist",
                "state": "WA",
                "city": "Seattle, WA",
                "type": "Part-Time",
                "currency": "USD",
                "salaryMin": 99000,
                "salaryMax": 100000,
                "company": "TechCorp",
                "industry": "Analytics",
                "website": null,
                "minYearExperience": null,
                "technologies": [
                    "JavaScript",
                    "Node.js",
                    "React"
                ],
                "datePosted": "2025-07-25T05:29:34.503Z"
            },
            {
                "createdAt": "2025-07-30T09:10:30.305Z",
                "id": 1955,
                "jobId": "P1-126",
                "position": "Data Scientist",
                "state": "WA",
                "city": "Seattle, WA",
                "type": "Full-Time",
                "currency": "USD",
                "salaryMin": 97000,
                "salaryMax": 100000,
                "company": "DataWorks",
                "industry": "Technology",
                "website": null,
                "minYearExperience": null,
                "technologies": [
                    "JavaScript",
                    "Node.js",
                    "React"
                ],
                "datePosted": "2025-07-22T21:11:55.562Z"
            },
        ]
    })
    jobs: Array<JobDto>;

    @ApiProperty({ description: 'Total number of items (without pagination)' })
    total: number;

    @ApiProperty()
    page: number;

    @ApiProperty({ description: 'Number of items per page' })
    pageSize: number;
} 