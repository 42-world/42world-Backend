import { IntraAuthMailDto } from '@app/common/cache/dto/intra-auth.dto';
import { TIME2LIVE } from '@app/utils/utils';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache, CachingConfig } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async setIntraAuthMailData(code: string, value: IntraAuthMailDto): Promise<void> {
    await this.cacheManager.set<IntraAuthMailDto>(code, value, {
      ttl: TIME2LIVE,
    });
  }

  getIntraAuthMailData(code: string): Promise<IntraAuthMailDto> {
    return this.cacheManager.get<IntraAuthMailDto>(code);
  }

  async set<T>(key: string, value: T, options?: CachingConfig): Promise<void> {
    await this.cacheManager.set<T>(key, value, options);
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }

  async del(code: string): Promise<void> {
    await this.cacheManager.del(code);
  }
}
