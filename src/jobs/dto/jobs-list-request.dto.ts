import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsEnum, Max, Min, IsArray, ValidateIf, Validate } from 'class-validator';
import { JobType, Currency } from '../types';
import { SalaryMaxNotLessThanSalaryMin, SalaryMinNotGreaterThanSalaryMax } from '../validators';

export class JobsListRequest {
  @IsOptional()
  @IsString()
  readonly position?: string;

  @IsOptional()
  @IsString()
  readonly state?: string;

  @IsOptional()
  @IsString()
  readonly city?: string;

  @IsOptional()
  @IsString()
  readonly company?: string;

  @IsOptional()
  @IsEnum(JobType)
  readonly type?: JobType;

  @IsOptional()
  @IsEnum(Currency)
  readonly currency?: Currency;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => {
    return Number.isNaN(Number(value)) ? undefined : Number(value);
  })
  @ValidateIf(o => o.salaryMax !== undefined)
  @Validate(SalaryMinNotGreaterThanSalaryMax)
  readonly salaryMin?: number;

  @IsOptional()
  @IsNumber()
  @Max(1000000)
  @Transform(({ value }) => {
    return Number.isNaN(Number(value)) ? undefined : Number(value);
  })
  @ValidateIf(o => o.salaryMin !== undefined)
  @Validate(SalaryMaxNotLessThanSalaryMin)
  readonly salaryMax?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  readonly technologies?: string[];


  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly page?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly pageSize?: number;
}
