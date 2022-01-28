import { CACHE_MANAGER, Controller, Get, Inject } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '@auth/auth.decorator';
import axios from 'axios';
import { Cache } from 'cache-manager';

const FT_CHECKIN_API = 'FT_CHECKIN_API';
const FT_CHECKIN_CACHE_TTL = 100;

class GetFtCheckinDto {
  @ApiProperty({ example: 42 })
  gaepo: number;

  @ApiProperty({ example: 0 })
  seocho: number;
}

@ApiTags('Hello')
@Controller()
export class AppController {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Hello world!' })
  @ApiOkResponse({ description: 'Hello world!' })
  getHello(): string {
    return 'Hello World!';
  }

  @Get('ft-checkin')
  @Public()
  @ApiOperation({ summary: '42checkin api' })
  @ApiOkResponse({
    description: '42체크인 user using api 결과',
    type: GetFtCheckinDto,
  })
  async getFtCheckin(): Promise<GetFtCheckinDto> {
    const ftCheckinData = await this.cacheManager.get<GetFtCheckinDto>(
      FT_CHECKIN_API,
    );

    if (!ftCheckinData) {
      const { data } = await axios.get(
        'https://api.checkin.42seoul.io/user/using',
      );
      await this.cacheManager.set(FT_CHECKIN_API, data, {
        ttl: FT_CHECKIN_CACHE_TTL,
      });

      return data;
    }
    return ftCheckinData;
  }
}
