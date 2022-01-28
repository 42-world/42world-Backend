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
import { HOUR } from './utils';
import { AppService, GetFtCheckinDto } from './app.service';

const FT_CHECKIN_API = 'FT_CHECKIN_API';
const FT_CHECKIN_CACHE_TTL = 100;

const MAX_CHECKIN_API = 'MAX_CHECKIN_API';
const MAX_CHECKIN_CACHE_TTL = HOUR * 6;

class FtCheckData {
  @ApiProperty()
  now: GetFtCheckinDto;
  @ApiProperty()
  max: GetFtCheckinDto;
}
@ApiTags('Hello')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
    type: FtCheckData,
  })
  async getFtCheckin(): Promise<FtCheckData> {
    const checkinData = await this.appService.fetchData(
      FT_CHECKIN_API,
      FT_CHECKIN_CACHE_TTL,
      'https://api.checkin.42seoul.io/user/using',
    );

    const checkinInfo = await this.appService.fetchData(
      MAX_CHECKIN_API,
      MAX_CHECKIN_CACHE_TTL,
      'https://api.checkin.42seoul.io/config',
    );

    const data = {
      now: checkinData,
      max: checkinInfo,
    };

    return data;
  }
}
