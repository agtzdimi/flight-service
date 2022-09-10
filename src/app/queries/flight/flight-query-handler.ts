import { LogAsyncMethod } from '../../infrastructure/logging';
import { CACHE_MANAGER, Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FlightQuery } from './flight-query';
import { Flight } from 'src/app/domain/flight-service/flight-service-response.interface';
import { Cache } from 'cache-manager';

@QueryHandler(FlightQuery)
export class FlightQueryHandler implements IQueryHandler<FlightQuery> {
  logger: Logger;

  constructor(@Inject(CACHE_MANAGER) private _cacheManager: Cache) {
    this.logger = new Logger(FlightQueryHandler.name);
  }

  @LogAsyncMethod
  async execute(query: FlightQuery): Promise<Flight[]> {
    const flightData = await this._cacheManager.store.get<Flight[]>(
      'flight-data-all-services',
    );
    return flightData || [];
  }
}
