import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JobExternalSource1ResponseDto, JobExternalSource2ResponseDto } from '../dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class JobsExternalApiService {
  constructor(private readonly httpService: HttpService) { }

  async fetchSource1(): Promise<JobExternalSource1ResponseDto> {
    try {
      const response = await firstValueFrom(this.httpService.get<JobExternalSource1ResponseDto>('https://assignment.devotel.io/api/provider1/jobs'));
      return plainToClass(JobExternalSource1ResponseDto, response.data);
    } catch (error) {
      console.error('Error fetching jobs from endpoint 1:', error);
      throw error;
    }
  }

  async fetchSource2(): Promise<JobExternalSource2ResponseDto> {
    try {
      const response = await firstValueFrom(this.httpService.get<JobExternalSource2ResponseDto>('https://assignment.devotel.io/api/provider2/jobs'));
      return plainToClass(JobExternalSource2ResponseDto, response.data);
    } catch (error) {
      console.error('Error fetching jobs from endpoint 2:', error);
      throw error;
    }
  }
}
