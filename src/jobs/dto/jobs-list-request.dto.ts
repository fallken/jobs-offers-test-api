import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsEnum, Max, Min, IsArray, ValidateIf, Validate } from 'class-validator';
import { JobType, Currency } from '../types';
import { SalaryMaxNotLessThanSalaryMin, SalaryMinNotGreaterThanSalaryMax } from '../validators';
import { ApiProperty } from '@nestjs/swagger';

export class JobsListRequest {
  @ApiProperty({ 
    description: 'The position of the job e.g: Software Engineer, Backend Engineer, Data Scientist',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly position?: string;

  @ApiProperty({ 
    description: 'The state where the job is located e.g CA , TX , WA',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly state?: string;

  @ApiProperty({ 
    description: 'The city where the job is located e.g San Francisco, New York, Austin',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly city?: string;

  @ApiProperty({ 
    description: 'The company offering the job e.g BackEnd Solutions, DataWorks, TechCorp ,Creative Design Ltd',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly company?: string;

  @ApiProperty({ 
    description: 'The type of the job',
    enum: JobType,
    example: JobType['Full-Time'],
    required: false,
  })
  @IsOptional()
  @IsEnum(JobType)
  readonly type?: JobType;

  @ApiProperty({ 
    description: 'The currency of the salary',
    enum: Currency,
    example: Currency.USD,
    required: false,
  })
  @IsOptional()
  @IsEnum(Currency)
  readonly currency?: Currency;

  @ApiProperty({ 
    description: 'The minimum salary for the job',
    example: 60000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => {
    return Number.isNaN(Number(value)) ? undefined : Number(value);
  })
  @ValidateIf(o => o.salaryMax !== undefined)
  @Validate(SalaryMinNotGreaterThanSalaryMax)
  readonly salaryMin?: number;

  @ApiProperty({ 
    description: 'The maximum salary for the job',
    example: 120000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Max(1000000)
  @Transform(({ value }) => {
    return Number.isNaN(Number(value)) ? undefined : Number(value);
  })
  @ValidateIf(o => o.salaryMin !== undefined)
  @Validate(SalaryMaxNotLessThanSalaryMin)
  readonly salaryMax?: number;

  @ApiProperty({ 
    description: 'The technologies required for the job (comma-separated)',
    example: ['JavaScript', 'React', 'Node.js'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  readonly technologies?: string[];

  @ApiProperty({ 
    description: 'The page number for pagination',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly page?: number;

  @ApiProperty({ 
    description: 'The number of items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly pageSize?: number;
}
