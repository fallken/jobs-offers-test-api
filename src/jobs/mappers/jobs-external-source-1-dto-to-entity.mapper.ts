import { Injectable } from '@nestjs/common';
import { JobEntity } from '../entities/job.entity';
import { JobExternalSource1Dto } from '../dto/job-external-source-1-api-response.dto';
import { Currency, JobType } from '../types';

@Injectable()
export class JobExternalSource1DtoToEntityMapper { 
    mapDtoToEntities(dto: JobExternalSource1Dto[]): JobEntity[] { 
        return dto.map(job=> this.mapExternalSource1ToJobToEntity(job));
    } 
 
    private mapExternalSource1ToJobToEntity(dto: JobExternalSource1Dto): JobEntity {
        const job = new JobEntity();
        const salaryRange = dto.details.salaryRange.match(/\d+/g);

        job.jobId = dto.jobId;
        job.position = dto.title; 
        job.city = dto.details.location;
        job.type = JobType[dto.details.type] ?? JobType['Full-Time'];
        job.company = dto.company.name;
        job.industry = dto.company.industry;
        job.salaryMax = salaryRange? parseInt(salaryRange[1]) * 1000 : 0;;
        job.salaryMin = salaryRange? parseInt(salaryRange[0]) * 1000 : 0;
        job.state = dto.details.location.split(',')[1].trim();
        job.datePosted = new Date(dto.postedDate);
        job.technologies = dto.skills;
        job.currency = Currency.USD;

        return job; 
    }

    
}
