import { LogAsyncMethod } from '../../infrastructure/logging';
import { CACHE_MANAGER, Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FlightQuery } from './flight-query';
import { Flight } from '../../domain/flight-service/flight-service-response.interface';
import { Cache } from 'cache-manager';
import { FlightIntervalService } from '../../tasks/flight-interval.service';

@QueryHandler(FlightQuery)
export class FlightQueryHandler implements IQueryHandler<FlightQuery> {
  logger: Logger;

  constructor(
    @Inject(CACHE_MANAGER) private _cacheManager: Cache,
    private _flightIntervalService: FlightIntervalService,
  ) {
    this.logger = new Logger(FlightQueryHandler.name);
  }

  @LogAsyncMethod
  async execute(query: FlightQuery): Promise<Flight[]> {
    let flightData = await this._cacheManager.get<Flight[]>(
      'flight-data-all-services',
    );

    // Fallback if Redis is down to receive the data from the HTTP request instead
    if (!flightData?.length) {
      flightData = await this._flightIntervalService.fetchFlightDataInterval();
    }
    return flightData || [];
  }
}
