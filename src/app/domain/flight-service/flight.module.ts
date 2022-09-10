import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FlightRegistryService } from './services/flight-registry-service';
import { FirstFlightService } from './services/first-flight-service';
import { SecondFlightService } from './services/second-flight-service';
import { FlightResponseValidator } from './flight-response-validator';

@Module({
  imports: [HttpModule],
  providers: [
    FlightRegistryService,
    FirstFlightService,
    SecondFlightService,
    FlightResponseValidator,
  ],
  exports: [
    FlightRegistryService,
    FirstFlightService,
    SecondFlightService,
    FlightResponseValidator,
  ],
})
export class FlightModule {}
