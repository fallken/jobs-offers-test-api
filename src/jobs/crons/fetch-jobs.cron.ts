import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry, } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { JobsService } from '../services/jobs.service';
import { CronJob } from 'cron';
import { EXTERNAL_JOB_SYNC_CRON_NAME } from '../constants';
import { LoggerService } from '@/logger/services';
import { v4 as uuid } from 'uuid';
import { EnvService } from '@/core';

@Injectable()
export class FetchJobsCron implements OnModuleInit, OnModuleDestroy {
    constructor(
        private readonly service: JobsService,
        private readonly schedulerRegistry: SchedulerRegistry,
        private readonly envService: EnvService,
        private readonly logger: LoggerService,
    ) {
        this.logger.setContext(this.constructor.name);
    }

    onModuleInit() {
        const cronJobFrequency = this.envService.getAsString("EXTERNAL_JOB_SYNC_CRON_VALUE", CronExpression.EVERY_5_MINUTES);

        this.logger.info("[FetchJobsCron][onModuleDestroy] Initiating CronJob", { EXTERNAL_JOB_SYNC_CRON_NAME, cronJobFrequency })

        const job = new CronJob(cronJobFrequency, async () => {
            const correlationId = uuid();

            this.logger.info("[FetchJobsCron][onModuleInit]", {
                EXTERNAL_JOB_SYNC_CRON_NAME,
                cronJobFrequency,
                correlationId,
            });

            await this.service.fetchExternalJobSources(correlationId);
        });

        this.schedulerRegistry.addCronJob(EXTERNAL_JOB_SYNC_CRON_NAME, job);

        job.start();
    }

    onModuleDestroy() {
        this.logger.info("[FetchJobsCron][onModuleDestroy] Deleting CronJob", { EXTERNAL_JOB_SYNC_CRON_NAME });

        this.schedulerRegistry.deleteCronJob(EXTERNAL_JOB_SYNC_CRON_NAME);
    }
}