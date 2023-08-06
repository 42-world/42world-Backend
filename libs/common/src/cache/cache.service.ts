import { TIME2LIVE } from '@app/utils/utils';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache, CachingConfig } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly defaultCachingConfig: CachingConfig = {
    ttl: TIME2LIVE,
  };

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async set<T>(key: string, value: T, options: CachingConfig = this.defaultCachingConfig): Promise<void> {
    await this.cacheManager.set<T>(key, value, options);
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }

  async del(code: string): Promise<void> {
    await this.cacheManager.del(code);
  }
}
