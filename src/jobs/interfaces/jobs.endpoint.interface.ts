import { JobsListResponseDto, JobsListRequest } from "../dto";

export enum JobEndpointPaths {
    list = '/job-offers',
}

export interface IJobEndpoints {
    list(request: JobsListRequest): Promise<JobsListResponseDto>
}