import { Test, TestingModule } from '@nestjs/testing';
import { JobExternalSource1DtoToEntityMapper } from './jobs-external-source-1-dto-to-entity.mapper';
import { JobEntity } from '../entities/job.entity';
import { JobType } from '../types';
import { LoggerService } from '@/logger/services';
import { v4 as uuid } from 'uuid';
import { JobExternalSource1Dto } from '../dto';

describe('JobExternalSource1DtoToEntityMapper', () => {
    let mapper: JobExternalSource1DtoToEntityMapper;
    let loggerService: LoggerService;

    const mockLoggerService = {
        setContext: jest.fn(),
        info: jest.fn(),
        error: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JobExternalSource1DtoToEntityMapper,
                {
                    provide: LoggerService,
                    useValue: mockLoggerService,
                },
            ],
        }).compile();

        mapper = module.get<JobExternalSource1DtoToEntityMapper>(JobExternalSource1DtoToEntityMapper);
    });

    it('should be defined', () => {
        expect(mapper).toBeDefined();
    });

    describe('mapDtoToEntities', () => {
        it('should map an array of DTOs to an array of entities', () => {
            const mockDtos: JobExternalSource1Dto[] = [
                {
                    jobId: 'P1-285',
                    title: 'Software Engineer',
                    details: {
                        location: 'New York, NY',
                        type: JobType['Full-Time'],
                        salaryRange: '$80 - $120k',
                    },
                    company: {
                        name: 'Tech Corp',
                        industry: 'Technology',
                    },
                    skills: ['JavaScript', 'React', 'Node.js'],
                    postedDate: "2025-07-22T14:33:59.370Z",
                },
                {
                    jobId: 'P1-654',
                    title: 'Data Scientist',
                    details: {
                        location: 'San Francisco, CA',
                        type: JobType['Contract'],
                        salaryRange: '$100 - $150k',
                    },
                    company: {
                        name: 'Data Inc',
                        industry: 'Analytics',
                    },
                    skills: ['Python', 'SQL', 'Machine Learning'],
                    postedDate: "2025-07-23T14:33:59.370Z",
                },
            ];

            const correlationId = uuid();
            const entities: JobEntity[] = mapper.mapDtoToEntities(mockDtos, correlationId);

            expect(entities).toBeInstanceOf(Array);
            expect(entities.length).toBe(2);

            expect(entities[0].jobId).toBe('P1-285');
            expect(entities[0].position).toBe('Software Engineer');
            expect(entities[0].city).toBe('New York');
            expect(entities[0].state).toBe('NY');
            expect(entities[0].type).toBe(JobType['Full-Time']);
            expect(entities[0].company).toBe('Tech Corp');
            expect(entities[0].industry).toBe('Technology');
            expect(entities[0].salaryMin).toBe(80000);
            expect(entities[0].salaryMax).toBe(120000);
            expect(entities[0].datePosted).toEqual(new Date('2025-07-22T14:33:59.370Z'));
            expect(entities[0].technologies).toEqual(['JavaScript', 'React', 'Node.js']);
            expect(entities[0].currency).toBe('USD');

            expect(entities[1].jobId).toBe('P1-654');
            expect(entities[1].position).toBe('Data Scientist');
            expect(entities[1].city).toBe('San Francisco');
            expect(entities[1].state).toBe('CA');
            expect(entities[1].type).toBe(JobType.Contract);
            expect(entities[1].company).toBe('Data Inc');
            expect(entities[1].industry).toBe('Analytics');
            expect(entities[1].salaryMin).toBe(100000);
            expect(entities[1].salaryMax).toBe(150000);
            expect(entities[1].datePosted).toEqual(new Date('2025-07-23T14:33:59.370Z'));
            expect(entities[1].technologies).toEqual(['Python', 'SQL', 'Machine Learning']);
            expect(entities[1].currency).toBe('USD');
        });

        it('should handle empty industry', () => {
            const mockDtos: JobExternalSource1Dto[] = [
                {
                    jobId: 'P1-286',
                    title: 'Product Manager',
                    details: {
                        location: 'Austin, TX',
                        type: JobType['Remote'],
                        salaryRange: '$90 - $140k',
                    },
                    company: {
                        name: 'Innovation Co',
                        industry: null,
                    },
                    skills: [ 'Aws'],
                    postedDate: '2025-07-22T00:55:48.148Z',
                },
            ];

            const correlationId = uuid();

            const entities: JobEntity[] = mapper.mapDtoToEntities(mockDtos, correlationId);

            expect(entities).toBeInstanceOf(Array);
            expect(entities.length).toBe(1);

            expect(entities[0].jobId).toBe('P1-286');
            expect(entities[0].position).toBe('Product Manager');
            expect(entities[0].city).toBe('Austin');
            expect(entities[0].state).toBe('TX');
            expect(entities[0].type).toBe(JobType['Remote']);
            expect(entities[0].company).toBe('Innovation Co');
            expect(entities[0].industry).toBe(null);
            expect(entities[0].salaryMin).toBe(90000);
            expect(entities[0].salaryMax).toBe(140000);
            expect(entities[0].datePosted).toEqual(new Date('2025-07-22T00:55:48.148Z'));
            expect(entities[0].technologies.length).toBe(1);
            expect(entities[0].technologies).toEqual(['Aws']);
            expect(entities[0].currency).toBe('USD');
        });

        it('should handle invalid salary range format', () => {
            const mockDtos: JobExternalSource1Dto[] = [
                {
                    jobId: 'P1-288',
                    title: 'Consultant',
                    details: {
                        location: 'Another City, AZ',
                        type: JobType['Full-Time'],
                        salaryRange: 'invalid',
                    },
                    company: {
                        name: 'Consulting Firm',
                        industry: 'Business',
                    },
                    skills: ['Strategy', 'Analysis'],
                    postedDate: '2025-07-20T13:26:11.647Z',
                },
            ];

            const correlationId = uuid();

            const entities: JobEntity[] = mapper.mapDtoToEntities(mockDtos, correlationId);

            expect(entities).toBeInstanceOf(Array);
            expect(entities.length).toBe(1);

            expect(entities[0].jobId).toBe('P1-288');
            expect(entities[0].position).toBe('Consultant');
            expect(entities[0].city).toBe('Another City');
            expect(entities[0].state).toBe('AZ');
            expect(entities[0].type).toBe(JobType['Full-Time']);
            expect(entities[0].company).toBe('Consulting Firm');
            expect(entities[0].industry).toBe('Business');
            expect(entities[0].salaryMin).toBe(0);
            expect(entities[0].salaryMax).toBe(0);
            expect(entities[0].datePosted).toEqual(new Date('2025-07-20T13:26:11.647Z'));
            expect(entities[0].technologies).toEqual(['Strategy', 'Analysis']);
            expect(entities[0].currency).toBe('USD');
        });

        it('should handle job details type  is undefined', () => {
            const mockDtos: JobExternalSource1Dto[] = [
                {
                    jobId: 'P1-290',
                    title: 'No Location Job',
                    details: {
                        location: 'New York, NY',
                        type: undefined,
                        salaryRange: '$70 - $130k',
                    },
                    company: {
                        name: 'Global Corp',
                        industry: 'Various',
                    },
                    skills: ['Generic Skills'],
                    postedDate: '2025-07-20T13:26:11.647Z',
                },
            ];

            const correlationId = uuid();

            const entities: JobEntity[] = mapper.mapDtoToEntities(mockDtos, correlationId);

            expect(entities).toBeInstanceOf(Array);
            expect(entities.length).toBe(1);

            expect(entities[0].jobId).toBe('P1-290');
            expect(entities[0].position).toBe('No Location Job');
            expect(entities[0].city).toBe('New York');
            expect(entities[0].state).toBe('NY');
            expect(entities[0].type).toBe(JobType['Full-Time']);
            expect(entities[0].company).toBe('Global Corp');
            expect(entities[0].industry).toBe('Various');
            expect(entities[0].salaryMin).toBe(70000);
            expect(entities[0].salaryMax).toBe(130000);
            expect(entities[0].datePosted).toEqual(new Date('2025-07-20T13:26:11.647Z'));
            expect(entities[0].technologies).toEqual(['Generic Skills']);
            expect(entities[0].currency).toBe('USD');
        });
    });
});
