import { Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  Flight,
  FlightServiceResponse,
} from './flight-service-response.interface';
import { FlightResponseValidator } from './flight-response-validator';
import { firstValueFrom, catchError, of } from 'rxjs';
import { retry } from 'radash';
import { LogAsyncMethod } from 'src/app/infrastructure/logging';

export abstract class FlightService {
  protected logger: Logger;

  abstract readonly uri: string;
  abstract readonly name: string;

  protected constructor(
    private httpService: HttpService,
    private validator: FlightResponseValidator,
  ) {
    this.logger = new Logger(FlightService.name);
  }

  @LogAsyncMethod
  async fetchFlights(): Promise<Flight[]> {
    const flightPromise = firstValueFrom(
      this.httpService.get<FlightServiceResponse>(this.uri).pipe(
        catchError((err) => {
          this.logger.error({
            stack: err.stack,
            code: err.code,
            message: err.message,
          });
          return of({ data: { flights: [] } });
        }),
      ),
    );

    const response = await retry(
      { times: 5, delay: 1000 },
      () => flightPromise,
    );

    let flights = response.data?.flights || [];

    flights = flights.filter((flight) => this.validator.validate(flight));
    return flights;
  }
}
