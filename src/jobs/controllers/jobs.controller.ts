import { Controller, Get, Query } from '@nestjs/common';
import { JobsService } from '../services/jobs.service';
import { IJobEndpoints, JobEndpointPaths } from '../interfaces/jobs.endpoint.interface';
import { JobsListRequest, JobsListResponseDto } from '../dto';
import { CorrelationId } from '@/core/decorators/correlation-id.decorator';
import { LoggerService } from '@/logger/services';
import { ApiBadRequestResponse, ApiResponse } from '@nestjs/swagger';
import { ErrorBadRequestResponseDto } from '@/core/dto';

@Controller(JobEndpointPaths.list)
export class JobsController implements IJobEndpoints {
  constructor(
    private readonly jobsService: JobsService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of jobs', type: JobsListResponseDto })
  @ApiBadRequestResponse({
    description: 'Bad Request - Validation errors',
    type: ErrorBadRequestResponseDto, 
  })
  list(@Query() request: JobsListRequest, @CorrelationId() correlationId: string): Promise<JobsListResponseDto> {
    return this.jobsService.list(request, correlationId);
  }
}