import { Injectable } from '@nestjs/common';
import { JobEntity } from '../entities/job.entity';
import { JobExternalSource1Dto } from '../dto/job-external-source-1-api-response.dto';
import { JobExternalSource2Dto, JobListDto } from '../dto/job-external-source-2-api-response.dto';
import { Currency, JobType } from '../types';
  
@Injectable()
export class JobExternalSource2DtoToEntityMapper {
    mapDtoToEntities(dto: JobListDto): JobEntity[] {
        return Object.keys(dto).map(key => this.mapExternalSource2ToJobToEntity(key, dto[key]))
    }

    private mapExternalSource2ToJobToEntity(jobId: string, dto: JobExternalSource2Dto): JobEntity {
        const job = new JobEntity();
        job.position = dto.position;
        job.jobId = jobId;
        job.city = dto.location.city;
        job.type = dto.location.remote ? JobType.Remote : JobType['Full-Time'];
        job.company = dto.employer.companyName;
        job.website = dto.employer.website.trim();
        job.salaryMax = dto.compensation.max;
        job.salaryMin = dto.compensation.min;
        job.state = dto.location.state;
        job.datePosted = new Date(dto.datePosted);
        job.technologies = dto.requirements.technologies;
        job.currency = dto.compensation.currency;
        job.minYearExperience = dto.requirements.experience;
        return job;
    }
}
