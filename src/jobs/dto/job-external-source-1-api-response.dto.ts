import { JobType } from "../types";

export class JobExternalSource1Dto {
    jobId: string;
    title: string;
    details: JobDetailsDto;
    company: CompanyDto;
    skills: string[];
    postedDate: string;
}

export class JobDetailsDto {
    location: string;
    type: JobType;
    salaryRange: string;
}

export class CompanyDto {
    name: string;
    industry: string;
}

export class MetadataDto {
    requestId: string;
    timestamp: string;
}

export class JobExternalSource1ApiResponseDto {
    metadata: MetadataDto;
    jobs: JobExternalSource1Dto[];
}