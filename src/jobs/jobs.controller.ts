import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JobsExternalApiService } from './services/jobs-external-api.service';
import { JobsService } from './services/jobs.service';

@Controller('job-offers')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly jobsExternalApiService: JobsExternalApiService,
  ) {}

  @Get()
  findAll() {
    return this.jobsExternalApiService.fetchSource1();
  }
}