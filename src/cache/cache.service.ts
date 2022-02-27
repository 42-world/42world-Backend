import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { TIME2LIVE } from '@root/utils';
import { IntraAuthMailDto } from '@cache/dto/intra-auth.dto';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async setIntraAuthMailData(code: string, value: IntraAuthMailDto) {
    await this.cacheManager.set<IntraAuthMailDto>(code, value, {
      ttl: TIME2LIVE,
    });
  }

  getIntraAuthMailData(code: string) {
    return this.cacheManager.get<IntraAuthMailDto>(code);
  }

  async del(code: string) {
    await this.cacheManager.del(code);
  }
}
