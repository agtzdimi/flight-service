import { FlightService } from '../flight-service.abstract';
import { HttpService } from '@nestjs/axios';
import { FlightResponseValidator } from '../flight-response-validator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SecondFlightService extends FlightService {
  uri = 'https://coding-challenge.powerus.de/flight/source2';
  name = 'Second';

  constructor(httpService: HttpService, validator: FlightResponseValidator) {
    super(httpService, validator);
  }
}
