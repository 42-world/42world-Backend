import { CacheService } from '@app/common/cache/cache.service';
import { logger } from '@app/utils/logger';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import axios from 'axios';

const GAEPO = 'gaepo';
const SEOCHO = 'seocho';

export class GetFtCheckinDto {
  @ApiProperty({ example: 42 })
  gaepo: number;

  @ApiProperty({ example: 0 })
  seocho: number;
}

@Injectable()
export class FtCheckinService {
  constructor(private readonly cacheService: CacheService) {}

  async fetchData(cacheKey: string): Promise<FtCheckinDto> {
    const ftCheckinData = await this.cacheService.get<FtCheckinDto>(cacheKey);

    if (!ftCheckinData) {
      try {
        const { data } = await axios.get(endpoint);
        const realData = {
          seocho: data[SEOCHO] || 0,
          gaepo: data[GAEPO] || 0,
        };

        await this.cacheService.set(cacheKey, realData, {
          ttl: cacheTTL,
        });
        return realData;
      } catch (e) {
        logger.error(e);
        throw new NotFoundException('데이터를 받아올 수 없습니다.');
      }
    }
    return ftCheckinData;
  }
}
