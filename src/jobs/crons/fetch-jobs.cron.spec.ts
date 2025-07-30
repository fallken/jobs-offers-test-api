import { Test, TestingModule } from '@nestjs/testing';
import { FetchJobsCron } from '../crons/fetch-jobs.cron';
import { JobsService } from '../services/jobs.service';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { LoggerService } from '@/logger/services';
import { EXTERNAL_JOB_SYNC_CRON_NAME } from '../constants';
import { v4 as uuid } from 'uuid';
import { EnvService } from '@/core';

jest.mock('cron', () => {
    return {
        CronJob: jest.fn().mockImplementation(() => ({
            start: jest.fn(),
            stop: jest.fn(),
        })),
    };
});

describe('FetchJobsCron', () => {
    let fetchJobsCron: FetchJobsCron;
    let jobsService: JobsService;
    let schedulerRegistry: SchedulerRegistry;
    let envService: EnvService;
    let loggerService: LoggerService;

    const correlationId = uuid();

    const mockJobsService = {
        fetchExternalJobSources: jest.fn(),
    };

    const mockSchedulerRegistry = {
        addCronJob: jest.fn(),
        deleteCronJob: jest.fn(),
    };

    const mockEnvService = {
        getAsString: jest.fn().mockReturnValue(correlationId), // Default cron value
    };

    const mockLoggerService = {
        setContext: jest.fn(),
        info: jest.fn(),
        error: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FetchJobsCron,
                {
                    provide: JobsService,
                    useValue: mockJobsService,
                },
                {
                    provide: SchedulerRegistry,
                    useValue: mockSchedulerRegistry,
                },
                {
                    provide: EnvService,
                    useValue: mockEnvService,
                },
                {
                    provide: LoggerService,
                    useValue: mockLoggerService,
                },
            ],
        }).compile();

        fetchJobsCron = module.get<FetchJobsCron>(FetchJobsCron);
        jobsService = module.get<JobsService>(JobsService);
        schedulerRegistry = module.get<SchedulerRegistry>(SchedulerRegistry);
        envService = module.get<EnvService>(EnvService);
        loggerService = module.get<LoggerService>(LoggerService);
    });

    it('should be defined', () => {
        expect(fetchJobsCron).toBeDefined();
    });

    describe('onModuleInit', () => {
        it('should initialize the cron job with the correct frequency', () => {
            fetchJobsCron.onModuleInit();

            expect(envService.getAsString).toHaveBeenCalledWith(
                'EXTERNAL_JOB_SYNC_CRON_VALUE',
                CronExpression.EVERY_5_MINUTES,
            );

            expect(schedulerRegistry.addCronJob).toHaveBeenCalled();
        });
    });

    describe('onModuleDestroy', () => {
        it('should delete the cron job', () => {
            fetchJobsCron.onModuleDestroy();

            expect(schedulerRegistry.deleteCronJob).toHaveBeenCalledWith(
                EXTERNAL_JOB_SYNC_CRON_NAME,
            );
        });
    });
});
