import { CACHE_MANAGER } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { FlightIntervalService } from '../../tasks/flight-interval.service';
import { FlightQuery } from './flight-query';
import { FlightQueryHandler } from './flight-query-handler';

let service: FlightQueryHandler;
let cache: Cache;
let flightIntervalService: FlightIntervalService;

beforeEach(async () => {
  const app = await Test.createTestingModule({
    providers: [
      FlightQueryHandler,
      {
        provide: CACHE_MANAGER,
        useValue: {
          get: () => Promise.resolve(() => jest.fn()),
          set: () => Promise.resolve(() => jest.fn()),
        },
      },
      {
        provide: FlightIntervalService,
        useValue: {
          fetchFlightDataInterval: () => Promise.resolve(() => jest.fn()),
        },
      },
    ],
  }).compile();
  service = app.get<FlightQueryHandler>(FlightQueryHandler);
  cache = app.get(CACHE_MANAGER);
  flightIntervalService = app.get(FlightIntervalService);
});

test(`FlightQueryHandler - Get value from cache`, async () => {
  const mockResponse = [
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
    {
      slices: [
        {
          origin_name: 'Schonefeld',
          destination_name: 'Stansted',
          departure_date_time_utc: '2019-08-08T20:25:00.000Z',
          arrival_date_time_utc: '2019-08-08T22:25:00.000Z',
          flight_number: '8545',
          duration: 120,
        },
        {
          origin_name: 'Stansted',
          destination_name: 'Schonefeld',
          departure_date_time_utc: '2019-08-10T06:50:00.000Z',
          arrival_date_time_utc: '2019-08-10T08:40:00.000Z',
          flight_number: '145',
          duration: 110,
        },
      ],
      price: 134.81,
    },
  ];
  const cacheSpy = jest.spyOn(cache, 'get').mockResolvedValueOnce(mockResponse);

  const query = new FlightQuery();
  const returned = await service.execute(query);

  expect(cacheSpy).toHaveBeenCalledTimes(1);
  expect(returned).toEqual(mockResponse);
});

test(`FlightQueryHandler - Cache is empty & receives value from http`, async () => {
  const mockResponse = [
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
    {
      slices: [
        {
          origin_name: 'Schonefeld',
          destination_name: 'Stansted',
          departure_date_time_utc: '2019-08-08T20:25:00.000Z',
          arrival_date_time_utc: '2019-08-08T22:25:00.000Z',
          flight_number: '8545',
          duration: 120,
        },
        {
          origin_name: 'Stansted',
          destination_name: 'Schonefeld',
          departure_date_time_utc: '2019-08-10T06:50:00.000Z',
          arrival_date_time_utc: '2019-08-10T08:40:00.000Z',
          flight_number: '145',
          duration: 110,
        },
      ],
      price: 134.81,
    },
  ];
  const cacheSpy = jest.spyOn(cache, 'get').mockResolvedValueOnce(undefined);
  const flightIntervalServiceSpy = jest
    .spyOn(flightIntervalService, 'fetchFlightDataInterval')
    .mockResolvedValueOnce(mockResponse);

  const query = new FlightQuery();
  const returned = await service.execute(query);

  expect(cacheSpy).toHaveBeenCalledTimes(1);
  expect(flightIntervalServiceSpy).toHaveBeenCalledTimes(1);
  expect(returned).toEqual(mockResponse);
});

test(`FlightQueryHandler - Cache contains empty array & receives value from http`, async () => {
  const mockResponse = [
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
    {
      slices: [
        {
          origin_name: 'Schonefeld',
          destination_name: 'Stansted',
          departure_date_time_utc: '2019-08-08T20:25:00.000Z',
          arrival_date_time_utc: '2019-08-08T22:25:00.000Z',
          flight_number: '8545',
          duration: 120,
        },
        {
          origin_name: 'Stansted',
          destination_name: 'Schonefeld',
          departure_date_time_utc: '2019-08-10T06:50:00.000Z',
          arrival_date_time_utc: '2019-08-10T08:40:00.000Z',
          flight_number: '145',
          duration: 110,
        },
      ],
      price: 134.81,
    },
  ];
  const cacheSpy = jest.spyOn(cache, 'get').mockResolvedValueOnce(undefined);
  const flightIntervalServiceSpy = jest
    .spyOn(flightIntervalService, 'fetchFlightDataInterval')
    .mockResolvedValueOnce(mockResponse);

  const query = new FlightQuery();
  const returned = await service.execute(query);

  expect(cacheSpy).toHaveBeenCalledTimes(1);
  expect(flightIntervalServiceSpy).toHaveBeenCalledTimes(1);
  expect(returned).toEqual(mockResponse);
});

test(`FlightQueryHandler - returns empty array if both cache and http returned nothing`, async () => {
  const cacheSpy = jest.spyOn(cache, 'get').mockResolvedValueOnce(undefined);
  const flightIntervalServiceSpy = jest
    .spyOn(flightIntervalService, 'fetchFlightDataInterval')
    .mockResolvedValueOnce([]);

  const query = new FlightQuery();
  const returned = await service.execute(query);

  expect(cacheSpy).toHaveBeenCalledTimes(1);
  expect(flightIntervalServiceSpy).toHaveBeenCalledTimes(1);
  expect(returned).toEqual([]);
});
