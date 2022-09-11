import { Module } from '@nestjs/common';
import { FlightModule } from '../domain/flight-service/flight.module';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { FlightIntervalService } from './flight-interval.service';

@Module({
  imports: [FlightModule, InfrastructureModule],
  providers: [FlightIntervalService],
  exports: [FlightIntervalService],
})
export class TasksModule {}
