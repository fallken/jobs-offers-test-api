import { Injectable } from '@nestjs/common';
import { DataSource, InsertResult, Repository } from 'typeorm';
import { JobEntity } from '../entities/job.entity';

@Injectable()
export class JobsRepository extends Repository<JobEntity> {
    constructor(private dataSource: DataSource) {
        super(JobEntity, dataSource.createEntityManager());
    }

    /**
        * Returns TypeORM repository for JobEntity
    */
    get repository(): Repository<JobEntity> {
        return this.dataSource.getRepository<JobEntity>(JobEntity);
    }

    async upsert(entities: JobEntity[]): Promise<InsertResult> {
        return this.repository.upsert(entities,["jobId"] as Partial<keyof JobEntity>[]);
    }
}