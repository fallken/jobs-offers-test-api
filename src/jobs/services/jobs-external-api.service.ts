import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JobExternalSource1ApiResponseDto, JobExternalSource2ApiResponseDto } from '../dto';
import { EXTERNAL_SOURCE_URL_1, EXTERNAL_SOURCE_URL_2 } from '../constants';

@Injectable()
export class JobsExternalApiService {
  constructor(private readonly httpService: HttpService) { }

  async fetchSource1(): Promise<JobExternalSource1ApiResponseDto> {
    try {
      const response = await firstValueFrom(this.httpService.get<JobExternalSource1ApiResponseDto>(EXTERNAL_SOURCE_URL_1));
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs from endpoint 1:', error);
      throw error;
    }
  }

  async fetchSource2(): Promise<JobExternalSource2ApiResponseDto> {
    try {
      const response = await firstValueFrom(this.httpService.get<JobExternalSource2ApiResponseDto>(EXTERNAL_SOURCE_URL_2));
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs from endpoint 2:', error);
      throw error;
    }
  }
}
