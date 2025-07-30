import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from '../controllers/jobs.controller';
import { JobsService } from '../services/jobs.service';
import { JobsListRequest, JobsListResponseDto } from '../dto';
import { LoggerService } from '@/logger/services';
import { v4 as uuid } from 'uuid';
import { JobsExternalApiService } from '../services';

describe('JobsController', () => {
    let controller: JobsController;
    let service: JobsService;

    const mockJobsListResponse: JobsListResponseDto = {
        jobs: [],
        total: 0,
        page: 1,
        pageSize: 10,
    };

    const mockLoggerService = {
        setContext: jest.fn(),
        info: jest.fn(),
    };


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [JobsController],
            providers: [
                {
                    provide: JobsService,
                    useValue: {
                        list: jest.fn().mockResolvedValue(mockJobsListResponse),
                    },
                },
                {
                    provide: LoggerService,
                    useValue: mockLoggerService,
                }
            ],
        }).compile();

        controller = module.get<JobsController>(JobsController);
        service = module.get<JobsService>(JobsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('list response', () => {
        it('should call the jobsService.list method with the correct parameters', async () => {
            const request: JobsListRequest = {};
            const correlationId = uuid();

            await controller.list(request, correlationId);

            expect(service.list).toHaveBeenCalledWith(request, correlationId);
        });

        it('should return the result of the jobsService.list method', async () => {
            const request: JobsListRequest = {};
            const correlationId = uuid();

            const result = await controller.list(request, correlationId);

            expect(result).toEqual(mockJobsListResponse);
        });
    });
});
