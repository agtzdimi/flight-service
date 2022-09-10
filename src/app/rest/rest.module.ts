import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { QueriesModule } from '../queries/queries.module';
import { FlightController } from './flight-controller';

@Module({
  controllers: [FlightController],
  imports: [CqrsModule, ConfigModule, QueriesModule],
  providers: [],
})
export class RestModule {}
