import { FirstFlightService } from './first-flight-service';
import { Injectable } from '@nestjs/common';
import { SecondFlightService } from './second-flight-service';
import { FlightService } from '../flight-service.abstract';

@Injectable()
export class FlightRegistryService {
  constructor(
    private _firstFlightService: FirstFlightService,
    private _secondFlightService: SecondFlightService,
  ) {}

  getServices(): FlightService[] {
    return [this._firstFlightService, this._secondFlightService];
  }
}
