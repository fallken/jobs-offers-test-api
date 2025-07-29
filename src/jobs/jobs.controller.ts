import { Controller, Get, Query } from '@nestjs/common';
import { JobsService } from './services/jobs.service';
import { IJobEndpoints, JobEndpointPaths } from './interfaces/jobs.endpoint.interface';
import { JobsListRequest, JobsListResponseDto } from './dto';

@Controller(JobEndpointPaths.list)
export class JobsController implements IJobEndpoints {
  constructor(
    private readonly jobsService: JobsService,
  ) { }

  @Get()
  list(@Query() request: JobsListRequest): Promise<JobsListResponseDto> {
    return this.jobsService.list(request);
  }
}