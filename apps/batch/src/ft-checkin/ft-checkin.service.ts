import { CacheService } from '@app/common/cache/cache.service';
import { FT_CHECKIN_KEY, MAX_CHECKIN_KEY } from '@app/common/cache/dto/ft-checkin.constant';
import { logger } from '@app/utils/logger';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import {
  FT_CHECKIN_CACHE_TTL,
  FT_CHECKIN_END_POINT,
  GAEPO,
  MAX_CHECKIN_CACHE_TTL,
  MAX_CHECKIN_END_POINT,
  SEOCHO,
} from './ft-checkin.constant';

@Injectable()
export class FtCheckinService {
  constructor(private readonly cacheService: CacheService) {}

  private async getData(cacheKey: string, endpoint: string, cacheTTL: number): Promise<void | never> {
    try {
      const { data } = await axios.get(endpoint);
      const realData = {
        seocho: data[SEOCHO] || 0,
        gaepo: data[GAEPO] || 0,
      };

      await this.cacheService.set(cacheKey, realData, {
        ttl: cacheTTL,
      });
    } catch (e) {
      throw new NotFoundException(`데이터를 받아올 수 없습니다. ${e.message}`);
    }
  }

  @Cron('0 */5 * * * *')
  async getNow() {
    await this.getData(FT_CHECKIN_KEY, FT_CHECKIN_END_POINT, FT_CHECKIN_CACHE_TTL);
    logger.info('FtCheckinService.getNow()');
  }

  @Cron('0 0 0 * * *')
  async getMax() {
    await this.getData(MAX_CHECKIN_KEY, MAX_CHECKIN_END_POINT, MAX_CHECKIN_CACHE_TTL);
    logger.info('FtCheckinService.getMax()');
  }
}
