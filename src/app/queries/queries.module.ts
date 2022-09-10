import { Module } from '@nestjs/common';
import { FlightQueryHandler } from './flight/flight-query-handler';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [FlightQueryHandler],
  exports: [FlightQueryHandler],
})
export class QueriesModule {}
