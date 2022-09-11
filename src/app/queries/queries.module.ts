import { Module } from '@nestjs/common';
import { FlightQueryHandler } from './flight/flight-query-handler';
import { HttpModule } from '@nestjs/axios';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [HttpModule, TasksModule],
  providers: [FlightQueryHandler],
  exports: [FlightQueryHandler],
})
export class QueriesModule {}
