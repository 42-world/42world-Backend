import { CacheService } from '@app/common/cache/cache.service';
import { FtCheckinDto } from '@app/common/cache/dto/ft-checkin.dto';
import { logger } from '@app/utils/logger';
import { errorHook } from '@app/utils/utils';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FtCheckinService {
  constructor(
    private readonly cacheService: CacheService, //
    private readonly configService: ConfigService,
  ) {}

  async fetchData(cacheKey: string): Promise<FtCheckinDto> {
    const ftCheckinData = await this.cacheService.get<FtCheckinDto>(cacheKey);

    if (!ftCheckinData) {
      logger.error(`Can't get data from cache with key: ${cacheKey}`);
      errorHook(
        'GetCheckInDataFromRedisError',
        `Can't get data from cache with key: ${cacheKey}`,
        this.configService.get('SLACK_HOOK_URL'),
      );
      return {
        gaepo: 0,
        seocho: 0,
      };
    }
    return ftCheckinData;
  }
}
