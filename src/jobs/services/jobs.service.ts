import { Injectable } from '@nestjs/common';
import { JobsExternalApiService } from './jobs-external-api.service';
import { JobsRepository } from '../repositories/jobs.repository';
import { JobExternalSource1DtoToEntityMapper, JobExternalSource2DtoToEntityMapper } from '../mappers';
import { JobExternalSource1ApiResponseDto, JobExternalSource2ApiResponseDto, JobsListRequest, JobsListResponseDto } from '../dto';
import { JobEntity } from '../entities/job.entity';
import { JobsListQueryBuilder } from '../utils/list-query-builder';
import { LoggerService } from '@/logger/services';

@Injectable()
export class JobsService {
    constructor(
        private readonly externalJobsApi: JobsExternalApiService,
        private readonly repository: JobsRepository,
        private readonly externalDtoSource1ToEntityMapper: JobExternalSource1DtoToEntityMapper,
        private readonly externalDtoSource2ToEntityMapper: JobExternalSource2DtoToEntityMapper,
        private readonly logger: LoggerService,
    ) { }

    /**
     * 
     * @param request 
     * @returns 
     */
    async list(request: JobsListRequest, correlationId?: string): Promise<JobsListResponseDto> {
        this.logger.info("[JobsService][list]", {
            ...request,
            correlationId,
        });

        const page = request.page || 1;
        const pageSize = request.pageSize || 10;

        const repo = this.repository.repository;

        const queryBuilder = repo.createQueryBuilder('job');
        const jobsQueryBuilder = new JobsListQueryBuilder(queryBuilder);

        jobsQueryBuilder.applyFilters(request);
        const [jobs, total] = await jobsQueryBuilder.paginate(page, pageSize);


        this.logger.info("[JobsService][list] results", {
            correlationId,
            jobs,
            total,
            page,
            pageSize,
        });

        return {
            jobs,
            total,
            page,
            pageSize,
        };
    }

    /**
     * Description: fetch external job endpoints and update the database with the new job items. there will be no duplicates
     */
    async fetchExternalJobSources(correlationId?: string) {
        const jobSource1: JobExternalSource1ApiResponseDto = await this.externalJobsApi.fetchSource1(correlationId);
        const jobSource2: JobExternalSource2ApiResponseDto = await this.externalJobsApi.fetchSource2(correlationId);
        const entities: JobEntity[] = [
            ...this.externalDtoSource1ToEntityMapper.mapDtoToEntities(jobSource1.jobs, correlationId),
            ...this.externalDtoSource2ToEntityMapper.mapDtoToEntities(jobSource2.data.jobsList, correlationId)
        ];

        await this.repository.upsert(this.filterDuplicateJobs(entities, correlationId));
    }

    /**
     * Filter jobs by JobId to prevent duplicates
     * @param jobs 
     * @returns 
     */
    private filterDuplicateJobs(jobs: JobEntity[], correlationId?: string): JobEntity[] {
        this.logger.info("[JobsService][filterDuplicateJobs]", {
            jobsLength: jobs.length,
            correlationId,
        });

        const jobIdSet: Set<string> = new Set<string>();
        const uniqueJobs: JobEntity[] = [];

        for (const job of jobs) {
            if (!jobIdSet.has(job.jobId)) {
                jobIdSet.add(job.jobId);
                uniqueJobs.push(job);
            }
        }

        return uniqueJobs;
    }
}