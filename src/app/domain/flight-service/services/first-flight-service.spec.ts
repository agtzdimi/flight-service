import { getUnitTestingModule } from '../../../test-utils/test-module';
import { FirstFlightService } from './first-flight-service';
import { HttpService } from '@nestjs/axios';
import { FlightResponseValidator } from '../flight-response-validator';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

let firstFlightService: FirstFlightService;
let httpService: HttpService;
let validator: FlightResponseValidator;

beforeEach(async () => {
  const testModule = await getUnitTestingModule(FirstFlightService);
  firstFlightService = testModule.get(FirstFlightService);
  httpService = testModule.get(HttpService);
  validator = testModule.get(FlightResponseValidator);
});

test('fetchFlights (flight service 1) - returns valid flights', async () => {
  const mockResponse = {
    flights: [
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
    ],
  };
  const fakeResponse: AxiosResponse = {
    status: 200,
    data: mockResponse,
    config: {},
    headers: {},
    request: {},
    statusText: '',
  };
  const httpServiceSpy = jest
    .spyOn(httpService, 'get')
    .mockReturnValue(of(fakeResponse));

  const validatorSpy = jest.spyOn(validator, 'validate').mockReturnValue(true);

  const returned = await firstFlightService.fetchFlights();

  expect(returned.length).toBe(2);

  const expectedUrl = `https://coding-challenge.powerus.de/flight/source1`;
  expect(httpServiceSpy).toHaveBeenCalledTimes(1);
  expect(httpServiceSpy).toHaveBeenCalledWith(expectedUrl);

  expect(validatorSpy).toHaveBeenCalledTimes(2);
});

test('fetchFlights (flight service 1) - returns empty array on not valid flights', async () => {
  const mockResponse = {
    flights: [
      {
        slices: [
          {
            origin_name: 'Schonefeld',
            destination_name: 'Stansted',
            departure_date_time_utc: '2019-08-08T04:30:00.000Z',
            arrival_date_time_utc: '2019-08-08T06:25:00.000Z',
            flight_number: '144',
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
    ],
  };
  const fakeResponse: AxiosResponse = {
    status: 200,
    data: mockResponse,
    config: {},
    headers: {},
    request: {},
    statusText: '',
  };
  const httpServiceSpy = jest
    .spyOn(httpService, 'get')
    .mockReturnValue(of(fakeResponse));

  const validatorSpy = jest.spyOn(validator, 'validate').mockReturnValue(false);

  const returned = await firstFlightService.fetchFlights();

  expect(returned.length).toBe(0);

  const expectedUrl = `https://coding-challenge.powerus.de/flight/source1`;
  expect(httpServiceSpy).toHaveBeenCalledTimes(1);
  expect(httpServiceSpy).toHaveBeenCalledWith(expectedUrl);

  expect(validatorSpy).toHaveBeenCalledTimes(2);
});

test('fetchFlights (flight service 1) - returns empty array on status code 500 from service', async () => {
  const fakeResponse: AxiosResponse = {
    status: 500,
    data: [],
    config: {},
    headers: {},
    request: {},
    statusText: '',
  };
  const httpServiceSpy = jest
    .spyOn(httpService, 'get')
    .mockReturnValue(of(fakeResponse));

  const validatorSpy = jest.spyOn(validator, 'validate').mockReturnValue(false);

  const returned = await firstFlightService.fetchFlights();

  expect(returned.length).toBe(0);

  const expectedUrl = `https://coding-challenge.powerus.de/flight/source1`;
  expect(httpServiceSpy).toHaveBeenCalledTimes(1);
  expect(httpServiceSpy).toHaveBeenCalledWith(expectedUrl);

  expect(validatorSpy).toHaveBeenCalledTimes(0);
});
