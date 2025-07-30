import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { JobsController } from './controllers';
import { JobsExternalApiService } from './services/jobs-external-api.service';
import { HttpModule } from '@nestjs/axios';
import { JobExternalSource1DtoToEntityMapper, JobExternalSource2DtoToEntityMapper } from './mappers';
import { JobsService } from './services/jobs.service';
import { JobsRepository } from './repositories/jobs.repositories';
import { FetchJobsCron } from './crons/fetch-jobs.cron';

const Mappers = [
  JobExternalSource1DtoToEntityMapper, JobExternalSource2DtoToEntityMapper
];
@Module({
  imports: [HttpModule],
  controllers: [JobsController],
  providers: [JobsService, JobsExternalApiService, JobsRepository, FetchJobsCron, ...Mappers],
  exports: [JobsRepository]
})
export class JobsModule implements OnApplicationBootstrap {
  constructor(
    private readonly service: JobsService
  ) { }

  async onApplicationBootstrap() {
    // await this.service.fetchExternalJobSources();
  }
}
