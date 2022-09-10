import { FlightService } from '../flight-service.abstract';
import { HttpService } from '@nestjs/axios';
import { FlightResponseValidator } from '../flight-response-validator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FirstFlightService extends FlightService {
  uri = 'https://coding-challenge.powerus.de/flight/source1';
  name = 'First';

  constructor(httpService: HttpService, validator: FlightResponseValidator) {
    super(httpService, validator);
  }
}
