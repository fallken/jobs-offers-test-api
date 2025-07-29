import { Currency } from "../types";

export class JobExternalSource2Dto {
  position: string;
  location: LocationDto;
  compensation: CompensationDto;
  employer: EmployerDto;
  requirements: RequirementsDto;
  datePosted: string;
}

export class LocationDto {
  city: string;
  state: string;
  remote: boolean;
}

export class CompensationDto {
  min: number;
  max: number;
  currency: Currency;
}

export class EmployerDto {
  companyName: string;
  website: string;
}

export class RequirementsDto {
  experience: number;
  technologies: string[];
}

export class JobListDto {
  [key: string]: JobExternalSource2Dto;
}

export class DataDto {
  jobsList: JobListDto;
}

export class JobExternalSource2ResponseDto {
  status: 'success' | 'failure';
  data: DataDto;
}
