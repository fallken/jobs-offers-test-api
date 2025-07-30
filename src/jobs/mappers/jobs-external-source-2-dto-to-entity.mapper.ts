import { Injectable } from '@nestjs/common';
import { JobEntity } from '../entities/job.entity';
import { JobExternalSource2Dto, JobListDto } from '../dto/job-external-source-2-api-response.dto';
import { JobType } from '../types';
import { LoggerService } from '@/logger/services';

@Injectable()
export class JobExternalSource2DtoToEntityMapper {
    constructor(
        private readonly logger: LoggerService,
    ) {
        this.logger.setContext(this.constructor.name);
    }


    mapDtoToEntities(dtos: JobListDto, correlationId?: string): JobEntity[] {
        this.logger.info("[JobExternalSource2DtoToEntityMapper][mapDtoToEntities]", { dtoLength: dtos.length, correlationId });

        return Object.keys(dtos).map(key => this.mapExternalSource2ToJobToEntity(key, dtos[key]))
    }

    private mapExternalSource2ToJobToEntity(jobId: string, dto: JobExternalSource2Dto, correlationId?: string): JobEntity {
        this.logger.info("[JobExternalSource2DtoToEntityMapper][mapExternalSource2ToJobToEntity]", { jobId, dto, correlationId });

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
