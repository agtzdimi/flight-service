import { CACHE_MANAGER } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { RedisService } from './redis';

let service: RedisService;
let cache: Cache;

beforeEach(async () => {
  const app = await Test.createTestingModule({
    providers: [
      RedisService,
      {
        provide: CACHE_MANAGER,
        useValue: {
          get: () => Promise.resolve(() => jest.fn()),
          set: () => Promise.resolve(() => jest.fn()),
        },
      },
    ],
  }).compile();
  service = app.get<RedisService>(RedisService);
  cache = app.get(CACHE_MANAGER);
});

// Then you can use jest.spyOn() to spy and mock

test(`should cache the value`, async () => {
  const cacheSpy = jest.spyOn(cache, 'set');

  await service.setRedisKey('test', 'testing');

  expect(cacheSpy).toHaveBeenCalledTimes(1);

  expect(cacheSpy.mock.calls[0][0]).toEqual('test');
  expect(cacheSpy.mock.calls[0][1]).toEqual('testing');
});

test(`should get the value from cache`, async () => {
  const cacheSpy = jest.spyOn(cache, 'get');

  await service.getRedisKey('test');

  expect(cacheSpy).toHaveBeenCalledTimes(1);
});

test(`should return the value from the cache`, async () => {
  jest.spyOn(cache, 'get').mockResolvedValueOnce('testValue');

  const res = await service.getRedisKey('test');

  expect(res).toEqual('testValue');
});
