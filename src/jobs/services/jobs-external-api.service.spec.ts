import { Test, TestingModule } from '@nestjs/testing';
import { JobsExternalApiService } from './jobs-external-api.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';
import {
    JobExternalSource1ApiResponseDto,
    JobExternalSource2ApiResponseDto,
} from '../dto';
import {
    EXTERNAL_SOURCE_URL_1,
    EXTERNAL_SOURCE_URL_2,
} from '../constants';
import { ExternalApiSourceException } from '../exception';
import { LoggerService } from '@/logger/services';
import { HttpStatus } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

describe('JobsExternalApiService', () => {
    let service: JobsExternalApiService;
    let httpService: HttpService;
    let loggerService: LoggerService;

    const mockLoggerService = {
        setContext: jest.fn(),
        info: jest.fn(),
        error: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JobsExternalApiService,
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
                {
                    provide: LoggerService,
                    useValue: mockLoggerService,
                },
            ],
        }).compile();

        service = module.get<JobsExternalApiService>(JobsExternalApiService);
        httpService = module.get<HttpService>(HttpService);
        loggerService = module.get<LoggerService>(LoggerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('fetchSource1', () => {
        const mockResponse: JobExternalSource1ApiResponseDto = {
            metadata: { requestId: '123', timestamp: 'now' },
            jobs: [],
        };

        it('should successfully fetch data from source 1', async () => {
            (httpService.get as jest.Mock).mockReturnValue(of({ data: mockResponse, status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse<JobExternalSource1ApiResponseDto>));
            const correlationId = uuid();
            const result = await service.fetchSource1(correlationId);
            expect(httpService.get).toHaveBeenCalledWith(EXTERNAL_SOURCE_URL_1);
            expect(result).toEqual(mockResponse);
        });

        it('should handle AxiosError and throw ExternalApiSourceException', async () => {
            const mockAxiosError = new AxiosError('Request failed', '502', undefined, undefined, {
                data: null,
                status: HttpStatus.BAD_GATEWAY,
                statusText: 'Bad Gateway',
                headers: {},
                config: {},
            } as AxiosResponse);

            (httpService.get as jest.Mock).mockReturnValue(throwError(() => mockAxiosError));
            const correlationId = uuid();
            await expect(service.fetchSource1(correlationId)).rejects.toThrow(ExternalApiSourceException);
            await expect(service.fetchSource1(correlationId)).rejects.toThrow(`Request failed`);
        });

        it('should handle generic errors and re-throw them', async () => {
            const mockError = new Error('Generic error');
            (httpService.get as jest.Mock).mockReturnValue(throwError(() => mockError));
            const correlationId = uuid();

            await expect(service.fetchSource1(correlationId)).rejects.toThrow(mockError);
        });
    });

    describe('fetchSource2', () => {
        const mockResponse: JobExternalSource2ApiResponseDto = {
            status: 'success',
            data: { jobsList: {} },
        };

        it('should successfully fetch data from source 2', async () => {
            (httpService.get as jest.Mock).mockReturnValue(of({ data: mockResponse, status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse<JobExternalSource2ApiResponseDto>));
            const correlationId = uuid();
            const result = await service.fetchSource2(correlationId);
            expect(httpService.get).toHaveBeenCalledWith(EXTERNAL_SOURCE_URL_2);
            expect(result).toEqual(mockResponse);
        });

        it('should handle AxiosError and throw ExternalApiSourceException for source 2', async () => {
            const mockAxiosError = new AxiosError('Request failed', '502', undefined, undefined, {
                data: null,
                status: HttpStatus.BAD_GATEWAY,
                statusText: 'Bad Gateway',
                headers: {},
                config: {},
            } as AxiosResponse);

            (httpService.get as jest.Mock).mockReturnValue(throwError(() => mockAxiosError));
            const correlationId = uuid();

            await expect(service.fetchSource2(correlationId)).rejects.toThrow(ExternalApiSourceException);
        });

        it('should handle generic errors and re-throw them for source 2', async () => {
            const mockError = new Error('Generic error');
            (httpService.get as jest.Mock).mockReturnValue(throwError(() => mockError));
            const correlationId = uuid();

            await expect(service.fetchSource2(correlationId)).rejects.toThrow(mockError);
        });
    });
});
