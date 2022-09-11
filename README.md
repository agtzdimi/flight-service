# Flight Services

The main idea of the project is to collect data from different flight services, concatenate them, remove duplicates
and send them back to the requestor

## Tech stack

To create the single endpoint to retrieve the data from the flight services we created a backend service using the
NestJS framework.

In order to have really low response time, a caching mechanism was utilized (Redis / NestJS internal memory).

CQRS was used (provided out of the box from NestJS) for the single endpoint as we want to separate Reads / Writes and be easily extensible for future
endpoints and features

## Structure

.
├── app.module.ts
├── domain
│   └── flight-service
│       ├── flight-response-validator.ts
│       ├── flight-service-response.interface.ts
│       ├── flight-service.abstract.ts
│       ├── flight.module.ts
│       └── services
│           ├── first-flight-service.ts
│           ├── flight-registry-service.ts
│           └── second-flight-service.ts
├── infrastructure
│   ├── infrastructure.module.ts
│   ├── logging.ts
│   └── redis.ts
├── queries
│   ├── flight
│   │   ├── flight-query-handler.ts
│   │   └── flight-query.ts
│   └── queries.module.ts
├── rest
│   ├── flight-controller.ts
│   └── rest.module.ts
└── tasks
    ├── flight-interval.service.ts
    └── tasks.module.ts
## Approach

### General approach
On start-up of the application and every 5 minutes we gonna fetch data from each of the services using the NestJS cron scheduler.

The data will be cached using the name of each service. After that we gonna concat the services data, remove duplicates
and cache the result as well. The data will have a 60 min TTL as after that we cannot consider the data valid.

As the services are not stable, and we may not get back data from the services. To tackle it:
 - There is a 5 times retry with a 1 sec backoff
 - If we still do not receive data, we look into the cached data of the service and use it.
 - If for one hour we cannot fetch data from that service (ttl: 60min), then an empty result will be provided from cache

### Code structure
- tasks:
  - It contains the cron scheduled task which can be also used as a fallback to the endpoint call if Redis is down for example
- rest:
  - Contains all the controllers i.e REST endpoints
- queries: As we are using CQRS there is a query bus from NestJS to execute all the Queries binded from the controllers. In our case it contains the flight query handler, and an empty Query as there are no variables in the GET request which may change
- infrastructure:
  - Contains the redis services to set / get a key and a logging service, to log the async methods when they finish with their duration
- domain:
  - Kind use a DDD (domain driven design), it contains the flight services to retrieve the data, and an abstract class to bind certain variables (name / uri) and maybe in the future some functions. The services classes extends the abstract class and can utilize its methods.
  - It also contains a validator so we can be sure that the received data from the services did not change data model
  - It contains a registry service which exposes to other modules an instance of the available services, so it can be dynamic and if a new service is implemented the class will extend the abstract one and added to the registry so all parts of the app will automatically updated.

### Prerequisites

Docker should installed when using the docker-compose binary.
if Docker is not utilized, NodeJS v16 was used for the development.

### Installation steps

To install the application the following steps should be executed:

Without Redis & Docker
- `git clone https://github.com/agtzdimi/flight-service` (Or download the zip file from the repo)
- At the project root run `npm i`
- To start the application: `npm start`

With Redis & Docker
- `git clone https://github.com/agtzdimi/flight-service` (Or download the zip file from the repo)
- At the project root run `docker-compose up`

## Acknowledgments

- NestJS Team for the awesome free framework [NestJS](https://nestjs.com/)
