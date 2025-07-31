<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Job Offers API: Overview

This application aggregates job offers from various external sources, deduplicates them, and provides a unified API for accessing them. It is built using NestJS. The application periodically fetches job data using a cron job and exposes it through REST endpoints. the cron job frequency is controllable using environment variables . also a general exception filter ensures consistent error responses.

## API Endpoints

While the exact endpoints are not specified, typical job offer APIs include:

* GET `/api/job-offers`: To retrieve a list of job offers. This endpoint supports filtering, pagination. and results are sorted by id descending. to check the filtering options please take a look at the documentation page `/api/docs`

## Running application locally
Please follow these steps to run the application locally: 
 - Copy the `envs/.env.example` to `envs/.env`: 
  ```bash
    cp ./envs/.env.example ./envs/.env
  ```
- Run the docker compose: 
```bash
    docker-compose up -d
```
- Run the Api: 
```bash
    yarn start:dev
```

## cron job
There is a cron job configured to fetch external job sources periodically `FetchJobsCron`. the default frequency is set to 5 minutes but you can change it using the env variable `EXTERNAL_JOB_SYNC_CRON_VALUE` . the value should be formatted like `* * * * * *` based on the values in enum `CronExpression`. 

## Swagger Documentation

The Swagger documentation endpoint (`/api/docs`) allows you to interact with your API documentation through a UI. This endpoint is automatically generated and contains request query params with examples and also provides response and error examples.

## Running E2E Tests

To run the end-to-end tests, you'll first need to set up the Docker environment defined in `docker-compose-e2e.yml`. This usually involves setting up a dedicated database instance for the tests. Once the Docker containers are running, you can execute the tests using the command:

```bash
docker-compose -f docker-compose-e2e.yml up -d && yarn test:e2e
```

## Running Unit tests
To run unit tests simply use the following command: 
```bash
yarn test
```


## Available envs 
```
DATABASE_HOST=localhost #DB host
DATABASE_PORT=5432 # DB PORT 
DATABASE_USERNAME=job_market # DB user
DATABASE_PASSWORD=job_market # DB password
DATABASE_NAME=job_market # DB name
DATABASE_SYNC=1 # DB typeorm sync Option

EXTERNAL_JOB_SYNC_CRON_VALUE=*/10 * * * * * # Cron job frequency

PRETTY_LOGS=1 # pino logger pretty logs option
LOGGER_MIN_LEVEL=trace # min level for logs e.g debug , info , error 