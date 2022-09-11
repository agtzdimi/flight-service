import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  logger: Logger;
  constructor(@Inject(CACHE_MANAGER) private _cacheManager: Cache) {
    this.logger = new Logger(RedisService.name);
  }

  public async setRedisKey(key: string, data: any, ttl = 3600) {
    await this._cacheManager
      .set(key, data, {
        ttl,
      })
      .catch((e) => {
        this.logger.error(`Redis Error while setting ${key}: ${e}`);
      });
  }

  public async getRedisKey(key: string) {
    return await this._cacheManager.get<any>(key).catch((e) => {
      this.logger.error(`Redis Error while getting ${key}:${e}`);
    });
  }
}
