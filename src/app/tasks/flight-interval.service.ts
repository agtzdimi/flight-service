import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { FlightRegistryService } from '../domain/flight-service/services/flight-registry-service';
import { LogAsyncMethod } from '../infrastructure/logging';
import { Cache } from 'cache-manager';
import { Flight } from '../domain/flight-service/flight-service-response.interface';
import { parallel } from 'radash';

@Injectable()
export class FlightIntervalService {
  constructor(
    @Inject(CACHE_MANAGER) private _cacheManager: Cache,
    private _flightRegistryService: FlightRegistryService,
  ) {
    this.fetchFlightDataInterval();
  }

  @LogAsyncMethod
  @Interval(1000 * 60 * 5)
  async fetchFlightDataInterval() {
    const services = this._flightRegistryService.getServices();
    const flightData = await parallel(50, services, async (service) => {
      return await service.fetchFlights();
    });
    for (const index in services) {
      const flightResults = flightData[index];
      if (flightResults.length) {
        await this._cacheManager.set(
          `${services[index].name}-flight-results`,
          flightResults,
          { ttl: 3600 },
        );
      } else {
        const redisData = await this._cacheManager.get<Flight[]>(
          `${services[index].name}-flight-results`,
        );
        if (redisData) {
          flightData[index] = redisData;
        }
      }
    }

    const finalData = this._removeDuplicates(flightData.flat());
    await this._cacheManager.set(`flight-data-all-services`, finalData, {
      ttl: 3600,
    });
  }

  private _removeDuplicates(array: Flight[]): Flight[] {
    const map: any = {};
    const result: Flight[] = [];
    array.forEach(function (obj) {
      const key = obj.slices
        .flatMap(
          (slice) =>
            slice.flight_number +
            '|' +
            slice.departure_date_time_utc +
            '|' +
            slice.arrival_date_time_utc,
        )
        .join('|');
      if (!map[key]) {
        map[key] = obj;
        result.push(obj);
      }
    });
    return result;
  }
}
