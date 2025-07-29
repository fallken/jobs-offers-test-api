import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { JobEntity } from '../entities/job.entity';
import { JobsListRequest } from '../dto';

export class JobsListQueryBuilder {
  private readonly alias: string = 'job';
  private readonly queryBuilder: SelectQueryBuilder<JobEntity>;

  constructor(
    private readonly selectQueryBuilder: SelectQueryBuilder<JobEntity>
  ) {
    this.queryBuilder = selectQueryBuilder
  }

  applyFilters(request: JobsListRequest): JobsListQueryBuilder {
    if (request.position) {
      this.queryBuilder.andWhere(`${this.alias}.position = :position`, { position: request.position });
    }

    if (request.state) {
      this.queryBuilder.andWhere(`${this.alias}.state = :state`, { state: request.state });
    }

    if (request.city) {
      this.queryBuilder.andWhere(`${this.alias}.city = :city`, { city: request.city });
    }

    if (request.company) {
      this.queryBuilder.andWhere(`${this.alias}.company = :company`, { company: request.company });
    }

    if (request.type) {
      this.queryBuilder.andWhere(`${this.alias}.type = :type`, { type: request.type });
    }

    if (request.currency) {
      this.queryBuilder.andWhere(`${this.alias}.currency = :currency`, { currency: request.currency });
    }

    if (request.salaryMin) {
      this.queryBuilder.andWhere(`${this.alias}."salaryMin" >= :salaryMin`, { salaryMin: request.salaryMin });
    }

    if (request.salaryMax) {
      this.queryBuilder.andWhere(`${this.alias}."salaryMax" <= :salaryMax`, { salaryMax: request.salaryMax });
    }

    if (request.technologies) {
      this.queryBuilder.andWhere(`${this.alias}.technologies  @> :technologies`, { technologies: request.technologies });
    }
    return this;
  }

  async paginate(page: number, pageSize: number): Promise<[JobEntity[], number]> {
    this.queryBuilder.skip((page - 1) * pageSize).take(pageSize);

    return this.queryBuilder.getManyAndCount();
  }

  getQueryBuilder(): SelectQueryBuilder<JobEntity> {
    return this.queryBuilder;
  }
}
