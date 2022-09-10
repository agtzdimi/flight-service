import { Controller, Get } from '@nestjs/common';
import { FlightQuery } from '../queries/flight/flight-query';
import { QueryBus } from '@nestjs/cqrs';

@Controller('flights')
export class FlightController {
  constructor(private _queryBus: QueryBus) {}

  @Get('latest')
  async fetchFlights() {
    const query = new FlightQuery();
    return this._queryBus.execute(query);
  }
}
