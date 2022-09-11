import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { utilities } from 'nest-winston';
import { LoggerOptions } from 'winston';
import { RestModule } from './rest/rest.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import * as redisStore from 'cache-manager-redis-store';
import type { ClientOpts } from 'redis';
import { InfrastructureModule } from './infrastructure/infrastructure.module';

const winstonFactory = async (
  configService: ConfigService,
): Promise<LoggerOptions> => {
  return {
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          utilities.format.nestLike(),
        ),
      }),
    ],
    level: configService.get<string>('LOG_LEVEL', 'debug'),
  };
};

@Module({
  imports: [
    ConfigModule.forRoot({}),
    CacheModule.register<ClientOpts>({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: +(process.env.REDIS_PORT || 6379),
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: winstonFactory,
    }),
    ScheduleModule.forRoot(),
    RestModule,
    TasksModule,
    InfrastructureModule,
  ],
})
export class AppModule {}
