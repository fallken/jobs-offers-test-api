import { Test, TestingModule } from '@nestjs/testing';
import { JobExternalSource2DtoToEntityMapper } from './jobs-external-source-2-dto-to-entity.mapper';
import { JobEntity } from '../entities/job.entity';
import { Currency, JobType } from '../types';
import { LoggerService } from '@/logger/services';
import { v4 as uuid } from 'uuid';
import { JobListDto } from '../dto';

describe('JobExternalSource2DtoToEntityMapper', () => {
    let mapper: JobExternalSource2DtoToEntityMapper;
    let loggerService: LoggerService;

    const mockLoggerService = {
        setContext: jest.fn(),
        info: jest.fn(),
        error: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JobExternalSource2DtoToEntityMapper,
                {
                    provide: LoggerService,
                    useValue: mockLoggerService,
                },
            ],
        }).compile();

        mapper = module.get<JobExternalSource2DtoToEntityMapper>(JobExternalSource2DtoToEntityMapper);
    });

    it('should be defined', () => {
        expect(mapper).toBeDefined();
    });

    describe('mapDtoToEntities', () => {
        it('should map an object of DTOs to an array of entities', () => {
            const mockDtos: JobListDto = {
                'job-858': {
                    position: 'Backend Engineer',
                    location: {
                        city: 'New York',
                        state: 'TX',
                        remote: true,
                    },
                    compensation: {
                        min: 56000,
                        max: 92000,
                        currency: Currency.USD,
                    },
                    employer: {
                        companyName: 'DataWorks',
                        website: 'https://creativedesign ltd.com',
                    },
                    requirements: {
                        experience: 5,
                        technologies: ['Java', 'Spring Boot', 'AWS'],
                    },
                    datePosted: '2025-07-27',
                },
                'job-810': {
                    position: 'Frontend Engineer',
                    location: {
                        city: 'Austin',
                        state: 'NY',
                        remote: false,
                    },
                    compensation: {
                        min: 77000,
                        max: 128000,
                        currency: Currency.USD,
                    },
                    employer: {
                        companyName: 'BackEnd Solutions',
                        website: 'https://techcorp.com',
                    },
                    requirements: {
                        experience: 4,
                        technologies: ['HTML', 'CSS', 'Vue.js'],
                    },
                    datePosted: '2025-07-24',
                },
            };

            const correlationId = uuid();
            const entities: JobEntity[] = mapper.mapDtoToEntities(mockDtos, correlationId);

            expect(entities).toBeInstanceOf(Array);
            expect(entities.length).toBe(2);

            expect(entities[0].jobId).toBe('job-858');
            expect(entities[0].position).toBe('Backend Engineer');
            expect(entities[0].city).toBe('New York');
            expect(entities[0].state).toBe('TX');
            expect(entities[0].type).toBe(JobType.Remote);
            expect(entities[0].company).toBe('DataWorks');
            expect(entities[0].website).toBe('https://creativedesign ltd.com');
            expect(entities[0].salaryMin).toBe(56000);
            expect(entities[0].salaryMax).toBe(92000);
            expect(entities[0].datePosted).toEqual(new Date('2025-07-27'));
            expect(entities[0].technologies).toEqual(['Java', 'Spring Boot', 'AWS']);
            expect(entities[0].currency).toBe('USD');
            expect(entities[0].minYearExperience).toBe(5);

            expect(entities[1].jobId).toBe('job-810');
            expect(entities[1].position).toBe('Frontend Engineer');
            expect(entities[1].city).toBe('Austin');
            expect(entities[1].state).toBe('NY');
            expect(entities[1].type).toBe(JobType['Full-Time']);
            expect(entities[1].company).toBe('BackEnd Solutions');
            expect(entities[1].website).toBe('https://techcorp.com');
            expect(entities[1].salaryMin).toBe(77000);
            expect(entities[1].salaryMax).toBe(128000);
            expect(entities[1].datePosted).toEqual(new Date('2025-07-24'));
            expect(entities[1].technologies).toEqual(['HTML', 'CSS', 'Vue.js']);
            expect(entities[1].currency).toBe('USD');
            expect(entities[1].minYearExperience).toBe(4);
        });
    });
});
