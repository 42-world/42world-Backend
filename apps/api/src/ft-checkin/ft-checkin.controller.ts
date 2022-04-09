import { FtCheckinService, GetFtCheckinDto } from './ft-checkin.service';
import { Controller, Get, NotFoundException } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '@api/auth/auth.decorator';
import { HOUR } from '@api/utils';

const FT_CHECKIN_API = 'FT_CHECKIN_API';
const FT_CHECKIN_CACHE_TTL = 100;
const FT_CHECKIN_END_POINT = 'https://api.checkin.42seoul.io/user/using';

const MAX_CHECKIN_API = 'MAX_CHECKIN_API';
const MAX_CHECKIN_CACHE_TTL = HOUR * 6;
const MAX_CHECKIN_END_POINT = 'https://api.checkin.42seoul.io/config';

class FtCheckData {
  @ApiProperty()
  now: GetFtCheckinDto;
  @ApiProperty()
  max: GetFtCheckinDto;
}

@ApiTags('ft-checkin')
@Controller('ft-checkin')
export class FtCheckinController {
  constructor(private readonly ftCheckinService: FtCheckinService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: '42checkin api' })
  @ApiOkResponse({
    description: '42체크인 user using api 결과',
    type: FtCheckData,
  })
  async getFtCheckin(): Promise<FtCheckData> {
    try {
      const checkinData = await this.ftCheckinService.fetchData(
        FT_CHECKIN_API,
        FT_CHECKIN_CACHE_TTL,
        FT_CHECKIN_END_POINT,
      );

      const checkinInfo = await this.ftCheckinService.fetchData(
        MAX_CHECKIN_API,
        MAX_CHECKIN_CACHE_TTL,
        MAX_CHECKIN_END_POINT,
      );

      const data = {
        now: checkinData,
        max: checkinInfo,
      };

      return data;
    } catch (e) {
      throw new NotFoundException('데이터를 받아올 수 없습니다');
    }
  }
}
