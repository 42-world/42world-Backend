import { CacheService } from '@app/common/cache/cache.service';
import { CacheModule as RedisModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    RedisModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST ?? 'localhost',
      port: process.env.REDIS_PORT ?? 6379,
      isGlobal: true,
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
