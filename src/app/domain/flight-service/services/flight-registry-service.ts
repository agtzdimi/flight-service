import { FirstFlightService } from './first-flight-service';
import { Injectable } from '@nestjs/common';
import { SecondFlightService } from './second-flight-service';
import { FlightService } from '../flight-service.abstract';

@Injectable()
export class FlightRegistryService {
  constructor(
    public firstFlightService: FirstFlightService,
    public secondFlightService: SecondFlightService,
  ) {}

  getServices(): FlightService[] {
    return [this.firstFlightService, this.secondFlightService];
  }
}
