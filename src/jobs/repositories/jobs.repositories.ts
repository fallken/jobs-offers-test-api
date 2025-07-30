import { Injectable } from '@nestjs/common';
import { DataSource, InsertResult, Repository } from 'typeorm';
import { JobEntity } from '../entities/job.entity';
import { LoggerService } from '@/logger/services';

@Injectable()
export class JobsRepository extends Repository<JobEntity> {
    constructor(
        private readonly dataSource: DataSource,
        private readonly logger: LoggerService,
    ) {
        super(JobEntity, dataSource.createEntityManager());

        this.logger.setContext(this.constructor.name);
    }

    /**
        * Returns TypeORM repository for JobEntity
    */
    get repository(): Repository<JobEntity> {
        return this.dataSource.getRepository<JobEntity>(JobEntity);
    }

    async upsert(entities: JobEntity[]): Promise<InsertResult> {
        this.logger.info("[JobsRepository][upsert]", { entitiesLength: entities.length });

        return this.repository.upsert(entities, ["jobId"] as Partial<keyof JobEntity>[]);
    }
}