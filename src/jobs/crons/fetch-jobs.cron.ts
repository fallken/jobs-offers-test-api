import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry, } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { JobsService } from '../services/jobs.service';
import { CronJob } from 'cron';
import { EXTERNAL_JOB_SYNC_CRON_NAME } from '../constants';

@Injectable()
export class FetchJobsCron implements OnModuleInit, OnModuleDestroy {
    constructor(
        private readonly service: JobsService,
        private readonly schedulerRegistry: SchedulerRegistry,
        private readonly config: ConfigService,
    ) { }

    onModuleInit() {
        const job = new CronJob(this.config.get("EXTERNAL_JOB_SYNC_CRON_VALUE", CronExpression.EVERY_5_MINUTES), async () => {
            await this.service.fetchExternalJobSources();
        });
    
        this.schedulerRegistry.addCronJob(EXTERNAL_JOB_SYNC_CRON_NAME, job);

        job.start();
    }

    onModuleDestroy() {
        this.schedulerRegistry.deleteCronJob(EXTERNAL_JOB_SYNC_CRON_NAME);
    }
}