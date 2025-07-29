import { Injectable } from '@nestjs/common';
import { JobsExternalApiService } from './jobs-external-api.service';
import { JobsRepository } from '../repositories/jobs.repositories';
import { JobExternalSource1DtoToEntityMapper, JobExternalSource2DtoToEntityMapper } from '../mappers';
import { JobExternalSource1ResponseDto, JobExternalSource2ResponseDto, JobsListRequest, JobsListResponseDto } from '../dto';
import { JobEntity } from '../entities/job.entity';
import { JobsListQueryBuilder } from '../utils/list-query-builder';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class JobsService {
    constructor(
        private readonly externalJobsApi: JobsExternalApiService,
        private readonly repository: JobsRepository,
        private readonly externalDtoSource1ToEntityMapper: JobExternalSource1DtoToEntityMapper,
        private readonly externalDtoSource2ToEntityMapper: JobExternalSource2DtoToEntityMapper,
        private readonly logger: PinoLogger,
    ) { }

    async list(request: JobsListRequest): Promise<JobsListResponseDto> {
        const page = request.page || 1;
        const pageSize = request.pageSize || 10;


        const queryBuilder = this.repository.repository.createQueryBuilder('job');
        const jobsQueryBuilder = new JobsListQueryBuilder(queryBuilder);

        jobsQueryBuilder.applyFilters(request);

        const [jobs, total] = await jobsQueryBuilder.paginate(page, pageSize);

        this.logger.info(`Found ${total} jobs`);

        return {
            jobs,
            total,
            page,
            pageSize,
        };
    }

    async fetchExternalJobSources() {
        const jobSource1: JobExternalSource1ResponseDto = await this.externalJobsApi.fetchSource1();
        const jobSource2: JobExternalSource2ResponseDto = await this.externalJobsApi.fetchSource2();
        const entities: JobEntity[] = [
            ...this.externalDtoSource1ToEntityMapper.mapDtoToEntities(jobSource1.jobs),
            ...this.externalDtoSource2ToEntityMapper.mapDtoToEntities(jobSource2.data.jobsList)
        ];

        await this.repository.upsert(entities);
    }
}