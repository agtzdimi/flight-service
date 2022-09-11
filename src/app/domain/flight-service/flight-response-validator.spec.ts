import { getUnitTestingModule } from '../../test-utils/test-module';
import { FlightResponseValidator } from './flight-response-validator';

let validator: FlightResponseValidator;

beforeEach(async () => {
  const testModule = await getUnitTestingModule(FlightResponseValidator);
  validator = testModule.get(FlightResponseValidator);
});

test('validate - returns false for missing slices', () => {
  const toValidate = {
    price: 129,
  };

  expect(validator.validate(toValidate)).toBe(false);
});

test('validate - returns false for missing price', () => {
  const toValidate = {
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
  };

  expect(validator.validate(toValidate)).toBe(false);
});

test('validate - returns false for missing origin_name', () => {
  const toValidate = {
    slices: [
      {
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
  };

  expect(validator.validate(toValidate)).toBe(false);
});

test('validate - returns false for missing destination_name', () => {
  const toValidate = {
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
        departure_date_time_utc: '2019-08-10T05:35:00.000Z',
        arrival_date_time_utc: '2019-08-10T07:35:00.000Z',
        flight_number: '8542',
        duration: 120,
      },
    ],
    price: 129,
  };

  expect(validator.validate(toValidate)).toBe(false);
});

test('validate - returns false for missing departure_date_time_utc', () => {
  const toValidate = {
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
        arrival_date_time_utc: '2019-08-10T07:35:00.000Z',
        flight_number: '8542',
        duration: 120,
      },
    ],
    price: 129,
  };

  expect(validator.validate(toValidate)).toBe(false);
});

test('validate - returns false for missing arrival_date_time_utc', () => {
  const toValidate = {
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
        flight_number: '8542',
        duration: 120,
      },
    ],
    price: 129,
  };

  expect(validator.validate(toValidate)).toBe(false);
});

test('validate - returns false for missing flight_number', () => {
  const toValidate = {
    slices: [
      {
        origin_name: 'Schonefeld',
        destination_name: 'Stansted',
        departure_date_time_utc: '2019-08-08T04:30:00.000Z',
        arrival_date_time_utc: '2019-08-08T06:25:00.000Z',
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
  };

  expect(validator.validate(toValidate)).toBe(false);
});

test('validate - returns false for missing duration', () => {
  const toValidate = {
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
  };

  expect(validator.validate(toValidate)).toBe(false);
});

test('validate - returns false for missing departure_date_time_utc', () => {
  const toValidate = {
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
  };

  expect(validator.validate(toValidate)).toBe(true);
});
