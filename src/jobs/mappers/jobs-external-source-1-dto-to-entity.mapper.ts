import { Injectable } from '@nestjs/common';
import { JobEntity } from '../entities/job.entity';
import { JobExternalSource1Dto } from '../dto/job-external-source-1-api-response.dto';
import { Currency, JobType } from '../types';
import { LoggerService } from '@/logger/services';

@Injectable()
export class JobExternalSource1DtoToEntityMapper {
    constructor(
        private readonly logger: LoggerService,
    ) {
        this.logger.setContext(this.constructor.name);
    }

    mapDtoToEntities(dtos: JobExternalSource1Dto[], correlationId?: string): JobEntity[] {
        this.logger.info("[JobExternalSource1DtoToEntityMapper][mapDtoToEntities]", { dtoLength: dtos.length, correlationId })

        return dtos.map(job => this.mapExternalSource1ToJobToEntity(job, correlationId));
    }

    private mapExternalSource1ToJobToEntity(dto: JobExternalSource1Dto, correlationId?: string): JobEntity {
        this.logger.info("[JobExternalSource1DtoToEntityMapper][mapExternalSource1ToJobToEntity]", { dto, correlationId });

        const job = new JobEntity();
        const salaryRange = dto.details.salaryRange.match(/\d+/g);
        const [city , state] = dto.details.location.split(',').map(next=>next.trim())

        job.jobId = dto.jobId;
        job.position = dto.title;
        job.city = city;
        job.type = JobType[dto.details.type] ?? JobType['Full-Time'];
        job.company = dto.company.name;
        job.industry = dto.company.industry;
        job.salaryMax = salaryRange ? parseInt(salaryRange[1]) * 1000 : 0;
        job.salaryMin = salaryRange ? parseInt(salaryRange[0]) * 1000 : 0;
        job.state = state;
        job.datePosted = new Date(dto.postedDate);
        job.technologies = dto.skills;
        job.currency = Currency.USD;

        return job;
    }


}
