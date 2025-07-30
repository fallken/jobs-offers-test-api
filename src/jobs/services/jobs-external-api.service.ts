import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JobExternalSource1ApiResponseDto, JobExternalSource2ApiResponseDto } from '../dto';
import { EXTERNAL_SOURCE_URL_1, EXTERNAL_SOURCE_URL_2 } from '../constants';
import { AxiosError } from 'axios';
import { PinoLogger } from 'nestjs-pino';
import { ExternalApiSourceException } from '../exception';

@Injectable()
export class JobsExternalApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async fetchSource1(): Promise<JobExternalSource1ApiResponseDto> {
    try {
      const response = await firstValueFrom(this.httpService.get<JobExternalSource1ApiResponseDto>(EXTERNAL_SOURCE_URL_1));
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching jobs from endpoint ${EXTERNAL_SOURCE_URL_1}`, error);

      if (error instanceof AxiosError) {
        throw new ExternalApiSourceException(error.message, EXTERNAL_SOURCE_URL_1, error.response?.status || HttpStatus.BAD_GATEWAY)
      }

      throw error;
    }
  }

  async fetchSource2(): Promise<JobExternalSource2ApiResponseDto> {
    try {
      const response = await firstValueFrom(this.httpService.get<JobExternalSource2ApiResponseDto>(EXTERNAL_SOURCE_URL_2));
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching jobs from endpoint ${EXTERNAL_SOURCE_URL_2}`, error);

      if (error instanceof AxiosError) {
        throw new ExternalApiSourceException(error.message, EXTERNAL_SOURCE_URL_1, error.response?.status || HttpStatus.BAD_GATEWAY)
      }

      throw error;
    }
  }
}
