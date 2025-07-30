import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { JobsExternalApiService } from './jobs-external-api.service';
import { JobsRepository } from '../repositories/jobs.repository';
import { JobExternalSource1DtoToEntityMapper, JobExternalSource2DtoToEntityMapper } from '../mappers';
import { JobExternalSource1ApiResponseDto, JobExternalSource1Dto, JobExternalSource2ApiResponseDto, JobExternalSource2Dto, JobsListRequest } from '../dto';
import { JobEntity } from '../entities/job.entity';
import { LoggerService } from '@/logger/services';
import { v4 as uuid } from 'uuid';

describe('JobsService', () => {
    let jobsService: JobsService;
    let jobsExternalApiService: JobsExternalApiService;
    let jobsRepository: JobsRepository;
    let jobExternalSource1DtoToEntityMapper: JobExternalSource1DtoToEntityMapper;
    let jobExternalSource2DtoToEntityMapper: JobExternalSource2DtoToEntityMapper;
    let loggerService: LoggerService;

    const mockJobsExternalApiService = {
        fetchSource1: jest.fn(),
        fetchSource2: jest.fn(),
    };

    const mockJobsRepository = {
        upsert: jest.fn(),
        repository: {
            createQueryBuilder: jest.fn().mockReturnValue({
                applyFilters: jest.fn().mockReturnThis(),
                paginate: jest.fn().mockResolvedValue([[], 0]),
                getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
            }),
        },
    };

    const mockJobExternalSource1DtoToEntityMapper = {
        mapDtoToEntities: jest.fn(),
    };

    const mockJobExternalSource2DtoToEntityMapper = {
        mapDtoToEntities: jest.fn(),
    };

    const mockLoggerService = {
        setContext: jest.fn(),
        info: jest.fn(),
        error: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JobsService,
                {
                    provide: JobsExternalApiService,
                    useValue: mockJobsExternalApiService,
                },
                {
                    provide: JobsRepository,
                    useValue: mockJobsRepository,
                },
                {
                    provide: JobExternalSource1DtoToEntityMapper,
                    useValue: mockJobExternalSource1DtoToEntityMapper,
                },
                {
                    provide: JobExternalSource2DtoToEntityMapper,
                    useValue: mockJobExternalSource2DtoToEntityMapper,
                },
                {
                    provide: LoggerService,
                    useValue: mockLoggerService,
                },
            ],
        }).compile();

        jobsService = module.get<JobsService>(JobsService);
        jobsExternalApiService = module.get<JobsExternalApiService>(JobsExternalApiService);
        jobsRepository = module.get<JobsRepository>(JobsRepository);
        jobExternalSource1DtoToEntityMapper = module.get<JobExternalSource1DtoToEntityMapper>(JobExternalSource1DtoToEntityMapper);
        jobExternalSource2DtoToEntityMapper = module.get<JobExternalSource2DtoToEntityMapper>(JobExternalSource2DtoToEntityMapper);
    });

    it('should be defined', () => {
        expect(jobsService).toBeDefined();
    });

    describe('list', () => {
        it('should return a list of jobs', async () => {
            const jobs: Array<Partial<JobEntity>> = [{ jobId: '1', position: 'Job 1' }, { jobId: '2', position: 'Job 2' }];
            const total = 2;

            mockJobsRepository.repository.createQueryBuilder.mockReturnValue({
                applyFilters: jest.fn().mockReturnThis(),
                paginate: jest.fn().mockResolvedValue([jobs, total]),
                getManyAndCount: jest.fn().mockResolvedValue([jobs, total]),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockResolvedValue(10),
            });

            const correlationId = uuid();

            const request: JobsListRequest = { page: 1, pageSize: 10 };
            const result = await jobsService.list(request, correlationId);

            expect(result.jobs).toEqual(jobs);
            expect(result.total).toEqual(total);
            expect(result.page).toEqual(1);
            expect(result.pageSize).toEqual(10);
        });

        it('should handle default pagination values', async () => {
            const mockJobs: Array<Partial<JobEntity>> = [{ jobId: '1', position: 'Job 1' }];
            const mockTotal = 1;

            mockJobsRepository.repository.createQueryBuilder.mockReturnValue({
                applyFilters: jest.fn().mockReturnThis(),
                paginate: jest.fn().mockResolvedValue([mockJobs, mockTotal]),
                getManyAndCount: jest.fn().mockResolvedValue([mockJobs, mockTotal]),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockResolvedValue(10),
            });
            const correlationId = uuid();
            const request: JobsListRequest = {};
            await jobsService.list(request, correlationId);

            expect(mockJobsRepository.repository.createQueryBuilder).toHaveBeenCalled();
        });
    });

    describe('fetchExternalJobSources', () => {
        it('should fetch and upsert jobs from external sources', async () => {
            const mockJobSource1: Partial<JobExternalSource1ApiResponseDto> = { jobs: [{ jobId: '1', title: 'Job 1' } as JobExternalSource1Dto] };
            const mockJobSource2: Partial<JobExternalSource2ApiResponseDto> = { data: { jobsList: { 'job-285': { position: 'Job 2' } as JobExternalSource2Dto } } };
            const mockEntities1: Array<Partial<JobEntity>> = [{ jobId: '1', position: 'Job 1' }];
            const mockEntities2: Array<Partial<JobEntity>> = [{ jobId: '2', position: 'Job 2' }];

            mockJobsExternalApiService.fetchSource1.mockResolvedValue(mockJobSource1);
            mockJobsExternalApiService.fetchSource2.mockResolvedValue(mockJobSource2);
            mockJobExternalSource1DtoToEntityMapper.mapDtoToEntities.mockReturnValue(mockEntities1);
            mockJobExternalSource2DtoToEntityMapper.mapDtoToEntities.mockReturnValue(mockEntities2);
            mockJobsRepository.upsert.mockResolvedValue(undefined);

            const correlationId = uuid();

            await jobsService.fetchExternalJobSources(correlationId);

            expect(jobsExternalApiService.fetchSource1).toHaveBeenCalledWith(correlationId);
            expect(jobsExternalApiService.fetchSource2).toHaveBeenCalledWith(correlationId);
            expect(jobExternalSource1DtoToEntityMapper.mapDtoToEntities).toHaveBeenCalledWith(mockJobSource1.jobs, correlationId);
            expect(jobExternalSource2DtoToEntityMapper.mapDtoToEntities).toHaveBeenCalledWith(mockJobSource2.data.jobsList, correlationId);
            expect(jobsRepository.upsert).toHaveBeenCalledWith([...mockEntities1, ...mockEntities2]); 
        });
    });

    describe('filterDuplicateJobs', () => {
        it('should filter out duplicate jobs based on jobId', () => {
            const jobs = [
                { jobId: 'job-285', position: 'Job 1' },
                { jobId: 'P1-500', position: 'Job 2' },
                { jobId: 'job-285', position: 'Job 1' },
            ] as JobEntity[];

            const correlationId = uuid();

            const uniqueJobs = jobsService.filterDuplicateJobs(jobs, correlationId);

            expect(uniqueJobs.length).toBe(2);
            expect(uniqueJobs[0].jobId).toBe('job-285');
            expect(uniqueJobs[1].jobId).toBe('P1-500');
        });

        it('should handle an empty array of jobs', () => {
            const correlationId = uuid();

            const uniqueJobs = jobsService.filterDuplicateJobs([], correlationId);
            expect(uniqueJobs.length).toBe(0);
        });
    });
});
