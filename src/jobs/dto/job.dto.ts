
import { ApiProperty } from '@nestjs/swagger';
import { Currency, JobType } from '../types';


export class JobDto {
    @ApiProperty({ description: 'The ID of the job' })
    id: number;

    @ApiProperty({ description: 'The job ID from the external source' })
    jobId: string;

    @ApiProperty({ description: 'e.g full-stack developer' })
    position: string;

    @ApiProperty({ description: 'state' })
    state: string;

    @ApiProperty({ description: 'city' })
    city: string;

    @ApiProperty({ enum: JobType, description: 'The type of the job - remote , full-time, contract , part-time' })
    type: JobType;

    @ApiProperty({ enum: Currency, description: 'salary currency' })
    currency: Currency;

    @ApiProperty({ description: 'The minimum salary' })
    salaryMin: number;

    @ApiProperty({ description: 'The maximum salary' })
    salaryMax: number;

    @ApiProperty({ description: 'The company' })
    company: string;

    @ApiProperty({ description: 'The industry - e.g analytics', nullable: true })
    industry?: string | null;

    @ApiProperty({ description: 'company website', nullable: true })
    website?: string | null;

    @ApiProperty({ description: 'The minimum years of experience required', nullable: true })
    minYearExperience?: number | null;

    @ApiProperty({ description: 'The technologies required for the job', type: [String] })
    technologies: string[];

    @ApiProperty({ description: 'The date the job was posted' })
    datePosted: Date;

    @ApiProperty({ description: 'The date the job was created' })
    createdAt: Date;
}
