import { Module } from '@nestjs/common';
import { RedisService } from './redis';

@Module({
  imports: [],
  providers: [RedisService],
  exports: [RedisService],
})
export class InfrastructureModule {}
