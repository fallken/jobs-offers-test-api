import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JobExternalSource1ApiResponseDto, JobExternalSource2ApiResponseDto } from '../dto';
import { EXTERNAL_SOURCE_URL_1, EXTERNAL_SOURCE_URL_2 } from '../constants';
import { AxiosError } from 'axios';
import { ExternalApiSourceException } from '../exception';
import { LoggerService } from '@/logger/services';

@Injectable()
export class JobsExternalApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async fetchSource1(correlationId?: string): Promise<JobExternalSource1ApiResponseDto> {
    try {
      this.logger.info("[JobsExternalApiService][fetchSource1]", {
        correlationId,
      });

      const response = await firstValueFrom(this.httpService.get<JobExternalSource1ApiResponseDto>(EXTERNAL_SOURCE_URL_1));
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching jobs from endpoint ${EXTERNAL_SOURCE_URL_1}`, {
        error, correlationId
      });

      if (error instanceof AxiosError) {
        throw new ExternalApiSourceException(error.message, EXTERNAL_SOURCE_URL_1, error.response?.status || HttpStatus.BAD_GATEWAY)
      }

      throw error;
    }
  }

  async fetchSource2(correlationId?: string): Promise<JobExternalSource2ApiResponseDto> {
    try {
      const response = await firstValueFrom(this.httpService.get<JobExternalSource2ApiResponseDto>(EXTERNAL_SOURCE_URL_2));
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching jobs from endpoint ${EXTERNAL_SOURCE_URL_2}`, {
        error, correlationId
      });

      if (error instanceof AxiosError) {
        throw new ExternalApiSourceException(error.message, EXTERNAL_SOURCE_URL_1, error.response?.status || HttpStatus.BAD_GATEWAY)
      }

      throw error;
    }
  }
}
