import { Injectable } from '@nestjs/common';
import { JobsExternalApiService } from './jobs-external-api.service';
import { JobsRepository } from '../repositories/jobs.repositories';
import { JobExternalSource1DtoToEntityMapper, JobExternalSource2DtoToEntityMapper } from '../mappers';
import { JobExternalSource1ResponseDto, JobExternalSource2ResponseDto } from '../dto';
import { JobEntity } from '../entities/job.entity';
 
@Injectable()
export class JobsService {
    constructor(
        private readonly externalJobsApi: JobsExternalApiService,
        private readonly repository: JobsRepository,
        private readonly externalDtoSource1ToEntityMapper: JobExternalSource1DtoToEntityMapper,
        private readonly externalDtoSource2ToEntityMapper: JobExternalSource2DtoToEntityMapper,
    ) { }

    async fetchExternalJobSources() {
        const jobSource1: JobExternalSource1ResponseDto = await this.externalJobsApi.fetchSource1();
        const jobSource2: JobExternalSource2ResponseDto = await this.externalJobsApi.fetchSource2();
        console.log("fetched results")
        console.log(jobSource1.jobs.length)
        const entities: JobEntity[] = [
            ...this.externalDtoSource1ToEntityMapper.mapDtoToEntities(jobSource1.jobs),
            ...this.externalDtoSource2ToEntityMapper.mapDtoToEntities(jobSource2.data.jobsList)
        ];
 
        await this.repository.upsert(entities);
    }
}