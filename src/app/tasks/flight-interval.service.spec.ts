import { SecondFlightService } from './../domain/flight-service/services/second-flight-service';
import { FirstFlightService } from './../domain/flight-service/services/first-flight-service';
import { getUnitTestingModule } from '../test-utils/test-module';
import { FlightRegistryService } from '../domain/flight-service/services/flight-registry-service';
import { RedisService } from '../infrastructure/redis';
import { FlightIntervalService } from './flight-interval.service';
import { FlightService } from '../domain/flight-service/flight-service.abstract';
import { createMock } from '@golevelup/ts-jest';

let flightRegistryService: FlightRegistryService;
let redisService: RedisService;
let flightIntervalService: FlightIntervalService;
let firstFlightService: FirstFlightService;
let secondFlightService: SecondFlightService;

beforeEach(async () => {
  const testModule = await getUnitTestingModule(FlightIntervalService);
  flightIntervalService = testModule.get(FlightIntervalService);
  redisService = testModule.get(RedisService);
  flightRegistryService = testModule.get(FlightRegistryService);
  firstFlightService = createMock();
  secondFlightService = createMock();
});

test('fetchFlightDataInterval - returns empty array', async () => {
  const mockResponse1 = [
    {
      slices: [
        {
          origin_name: 'Schonefeld',
          destination_name: 'Stansted',
          departure_date_time_utc: '2019-08-08T04:30:00.000Z',
          arrival_date_time_utc: '2019-08-08T06:25:00.000Z',
          flight_number: '144',
          duration: 115,
        },
        {
          origin_name: 'Stansted',
          destination_name: 'Schonefeld',
          departure_date_time_utc: '2019-08-10T05:35:00.000Z',
          arrival_date_time_utc: '2019-08-10T07:35:00.000Z',
          flight_number: '8542',
          duration: 120,
        },
      ],
      price: 129,
    },
  ];

  const mockResponse2 = [
    {
      slices: [
        {
          origin_name: 'Schonefeld',
          destination_name: 'Stansted',
          departure_date_time_utc: '2019-08-08T04:30:00.000Z',
          arrival_date_time_utc: '2019-08-08T06:25:00.000Z',
          flight_number: '144',
          duration: 115,
        },
        {
          origin_name: 'Stansted',
          destination_name: 'Schonefeld',
          departure_date_time_utc: '2019-08-10T05:35:00.000Z',
          arrival_date_time_utc: '2019-08-10T07:35:00.000Z',
          flight_number: '8542',
          duration: 120,
        },
      ],
      price: 129,
    },
  ];
  const services: FlightService[] = [firstFlightService, secondFlightService];

  const flightRegistryServiceSpy = jest
    .spyOn(flightRegistryService, 'getServices')
    .mockReturnValueOnce(services);

  const firstFlightServiceSpy = jest
    .spyOn(firstFlightService, 'fetchFlights')
    .mockResolvedValueOnce(mockResponse1);

  const secondFlightServiceSpy = jest
    .spyOn(secondFlightService, 'fetchFlights')
    .mockResolvedValueOnce(mockResponse2);

  const redisServiceSetSpy = jest
    .spyOn(redisService, 'setRedisKey')
    .mockResolvedValueOnce(undefined) // First on first flight service
    .mockResolvedValueOnce(undefined) // Second on second flight service
    .mockResolvedValueOnce(undefined); // Third on final data

  const redisServiceGetSpy = jest
    .spyOn(redisService, 'getRedisKey')
    .mockResolvedValueOnce(mockResponse1) // First on first flight service
    .mockResolvedValueOnce(mockResponse2); // Second on second flight service

  const returned = await flightIntervalService.fetchFlightDataInterval();

  expect(flightRegistryServiceSpy).toHaveBeenCalledTimes(1);

  expect(firstFlightServiceSpy).toHaveBeenCalledTimes(1);

  expect(secondFlightServiceSpy).toHaveBeenCalledTimes(1);

  expect(redisServiceSetSpy).toHaveBeenCalledTimes(3);
  expect(redisServiceGetSpy).toHaveBeenCalledTimes(0);
  expect(returned).toEqual([...mockResponse1, ...mockResponse2]);
});
