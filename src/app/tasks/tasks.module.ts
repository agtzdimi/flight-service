import { Module } from '@nestjs/common';
import { FlightModule } from '../domain/flight-service/flight.module';
import { FlightIntervalService } from './flight-interval.service';

@Module({
  imports: [FlightModule],
  providers: [FlightIntervalService],
  exports: [FlightIntervalService],
})
export class TasksModule {}
