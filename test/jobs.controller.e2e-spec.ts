import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Module, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { JobEndpointPaths } from '@/jobs/interfaces/jobs.endpoint.interface';
import { JobsRepository } from '@/jobs/repositories/jobs.repository';
import { JobEntity } from '@/jobs/entities/job.entity';
import { JobsService } from '@/jobs/services/jobs.service';
import { JobsController } from '@/jobs/controllers/jobs.controller';
import { JobsExternalApiService } from '@/jobs/services/jobs-external-api.service';
import { JobExternalSource1DtoToEntityMapper, JobExternalSource2DtoToEntityMapper } from '@/jobs/mappers';
import { LoggerService } from '@/logger/services';
import { HttpService } from '@nestjs/axios';
import { DataSource, Repository } from 'typeorm';
import { Currency, JobType } from '@/jobs/types';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from '@/core/core.module';
import { EnvService, HTTP_HEADER_CORRELATION_ID } from '@/core';
import { mockJobs } from './mocks';
import { v4 as uuid } from 'uuid';

describe('JobsController (e2e)', () => {
    let app: INestApplication;
    let jobsRepository: JobsRepository;
    let jobEntityRepository: Repository<JobEntity>;
    let dataSource: DataSource;


    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [JobsController],
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: process.cwd() + '/envs/.env.e2e',
                }),
                TypeOrmModule.forRootAsync({
                    imports: [ConfigModule, CoreModule],
                    useFactory: async (envService: EnvService) => ({
                        type: 'postgres',
                        host: envService.getAsString('DATABASE_HOST'),
                        port: envService.getAsNumber('DATABASE_PORT'),
                        username: envService.getAsString('DATABASE_USERNAME'),
                        password: envService.getAsString('DATABASE_PASSWORD'),
                        database: envService.getAsString('DATABASE_NAME'),
                        entities: [JobEntity],
                        synchronize: true,
                        dropSchema: true,
                    }),
                    inject: [EnvService],
                }),
                TypeOrmModule.forFeature([JobEntity]),
            ],
            providers: [
                JobsService,
                JobsRepository,
                {
                    provide: JobsExternalApiService,
                    useValue: {
                        fetchSource1: jest.fn(),
                        fetchSource2: jest.fn(),
                    },
                },
                {
                    provide: JobExternalSource1DtoToEntityMapper,
                    useValue: {
                        mapDtoToEntities: jest.fn()
                    }
                },
                {
                    provide: JobExternalSource2DtoToEntityMapper,
                    useValue: {
                        mapDtoToEntities: jest.fn()
                    }
                },
                {
                    provide: LoggerService,
                    useValue: {
                        info: jest.fn(),
                        error: jest.fn(),
                        setContext: jest.fn()
                    }
                },
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(new ValidationPipe({
            transform: true,
        }));

        jobsRepository = moduleFixture.get<JobsRepository>(JobsRepository);
        dataSource = moduleFixture.get<DataSource>(DataSource);
        jobEntityRepository = dataSource.getRepository(JobEntity);

        await jobEntityRepository.clear();
        await jobEntityRepository.insert(mockJobs);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/job-offers (GET) - should return 200 OK and a list of jobs', async () => {
        return request(app.getHttpServer())
            .get(JobEndpointPaths.list)
            .expect(200)
            .expect(res => {
                expect(Array.isArray(res.body.jobs)).toBe(true);
                expect(res.body.jobs.length).toBeGreaterThan(0);
                expect(res.body.jobs[0].position).toBe('Data Scientist');
            });
    });

    it('/job-offers (GET) - should filter jobs by position', () => {
        const position = 'Data Scientist';
        return request(app.getHttpServer())
            .get(`${JobEndpointPaths.list}?position=${position}`)
            .expect(200)
            .expect(res => {
                res.body.jobs.forEach(job => {
                    expect(job.position).toBe(position);
                });
            });
    });

    it('/job-offers (GET) - should filter jobs by state', () => {
        const state = 'WA';
        return request(app.getHttpServer())
            .get(`${JobEndpointPaths.list}?state=${state}`)
            .expect(200)
            .expect(res => {
                console.log("/job-offers (GET) - should filter jobs by state")
                console.log(res.body.jobs)
                res.body.jobs.forEach(job => {
                    expect(job.state).toBe(state);
                });
            });
    });

    it('/job-offers (GET) - should filter jobs by city', () => {
        const city = 'Seattle';
        return request(app.getHttpServer())
            .get(`${JobEndpointPaths.list}?city=${city}`)
            .expect(200)
            .expect(res => {
                res.body.jobs.forEach(job => {
                    expect(job.city).toBe(city);
                });
            });
    });

    it('/job-offers (GET) - should filter jobs by company', () => {
        const company = 'Another Mock Company';
        return request(app.getHttpServer())
            .get(`${JobEndpointPaths.list}?company=${company}`)
            .expect(200)
            .expect(res => {
                res.body.jobs.forEach(job => {
                    expect(job.company).toBe(company);
                });
            });
    });

    it('/job-offers (GET) - should filter jobs by type', () => {
        const type = JobType.Contract;
        return request(app.getHttpServer())
            .get(`${JobEndpointPaths.list}?type=${type}`)
            .expect(200)
            .expect(res => {
                res.body.jobs.forEach(job => {
                    expect(job.type).toBe(type);
                });
            });
    });

    it('/job-offers (GET) - should filter jobs by currency', () => {
        const currency = Currency.USD;
        return request(app.getHttpServer())
            .get(`${JobEndpointPaths.list}?currency=${currency}`)
            .expect(200)
            .expect(res => {
                res.body.jobs.forEach(job => {
                    expect(job.currency).toBe(currency);
                });
            });
    });

    it('/job-offers (GET) - should filter jobs by salaryMin', () => {
        const salaryMin = 95000;
        return request(app.getHttpServer())
            .get(`${JobEndpointPaths.list}?salaryMin=${salaryMin}`)
            .expect(200)
            .expect(res => {
                res.body.jobs.forEach(job => {
                    expect(job.salaryMin).toBeGreaterThanOrEqual(salaryMin);
                });
            });
    });

    it('/job-offers (GET) - should filter jobs by salaryMax', () => {
        const salaryMax = 115000;
        return request(app.getHttpServer())
            .get(`${JobEndpointPaths.list}?salaryMax=${salaryMax}`)
            .expect(200)
            .expect(res => {
                res.body.jobs.forEach(job => {
                    expect(job.salaryMax).toBeLessThanOrEqual(salaryMax);
                });
            });
    });

    it('/job-offers (GET) - should filter jobs by technologies', () => {
        const technologies = ['Python', 'Machine Learning'];
        return request(app.getHttpServer())
            .get(`${JobEndpointPaths.list}?technologies=${technologies.join(',')}`)
            .expect(200)
            .expect(res => {
                res.body.jobs.forEach(job => {
                    expect(job.technologies).toEqual(expect.arrayContaining(technologies));
                });
            });
    });

    it('/job-offers (GET) - should return 400 for invalid salary range (salaryMin > salaryMax)', () => {
        return request(app.getHttpServer())
            .get(`${JobEndpointPaths.list}?salaryMin=120000&salaryMax=100000`)
            .expect(400)
            .expect(res => {
                expect(res.body.message).toBeDefined();
                expect(res.body.statusCode).toBe(400);
            });
    });

    it('/job-offers (GET) - should return 200 with empty array if no jobs match', () => {
        return request(app.getHttpServer())
            .get(`${JobEndpointPaths.list}?position=NonExistent`)
            .expect(200)
            .expect(res => {
                expect(Array.isArray(res.body.jobs)).toBe(true);
                expect(res.body.jobs.length).toBe(0);
            });
    });

    it('/job-offers (GET) - should return paginated results', () => {
        const page = 1;
        const pageSize = 1;
        return request(app.getHttpServer())
            .get(`${JobEndpointPaths.list}?page=${page}&pageSize=${pageSize}`)
            .expect(200)
            .expect(res => {
                expect(res.body.page).toBe(page);
                expect(res.body.pageSize).toBe(pageSize);
                expect(Array.isArray(res.body.jobs)).toBe(true);
                expect(res.body.jobs.length).toBeLessThanOrEqual(pageSize);
                expect(res.body.total).toBe(mockJobs.length)
            });
    });

    it('/job-offers (GET) - pass correlation Id', () => {
        const correlationId = uuid();
        return request(app.getHttpServer())
            .get(JobEndpointPaths.list)
            .set(HTTP_HEADER_CORRELATION_ID, correlationId)
            .expect(200)
            .expect(res => {
                expect(res.headers[HTTP_HEADER_CORRELATION_ID.toLowerCase()]).toBe(correlationId);
            });
    });
});
