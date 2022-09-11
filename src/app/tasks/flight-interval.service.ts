import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FlightRegistryService } from '../domain/flight-service/services/flight-registry-service';
import { Cache } from 'cache-manager';
import { Flight } from '../domain/flight-service/flight-service-response.interface';
import { parallel } from 'radash';
import { RedisService } from '../infrastructure/redis';

@Injectable()
export class FlightIntervalService {
  logger: Logger;
  constructor(
    @Inject(CACHE_MANAGER) private _cacheManager: Cache,
    private _flightRegistryService: FlightRegistryService,
    private _redisService: RedisService,
  ) {
    this.logger = new Logger(FlightIntervalService.name);
    this.fetchFlightDataInterval();
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async fetchFlightDataInterval(): Promise<Flight[]> {
    const services = this._flightRegistryService.getServices();
    const flightData = await parallel(50, services, async (service) => {
      return await service.fetchFlights();
    });
    for (const index in services) {
      const flightResults = flightData[index];
      if (flightResults.length) {
        await this._redisService.setRedisKey(
          `${services[index].name}-flight-results`,
          flightResults,
        );
      } else {
        const redisData: Flight[] = await this._redisService.getRedisKey(
          `${services[index].name}-flight-results`,
        );

        if (redisData) {
          flightData[index] = redisData;
        }
      }
    }

    const finalData = this._removeDuplicates(flightData.flat());
    await this._redisService.setRedisKey('flight-data-all-services', finalData);

    return finalData;
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
