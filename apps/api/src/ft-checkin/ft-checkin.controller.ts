import { FT_CHECKIN_KEY, MAX_CHECKIN_KEY } from '@app/common/cache/dto/ft-checkin.constant';
import { FtCheckinDto } from '@app/common/cache/dto/ft-checkin.dto';
import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { FtCheckinService } from './ft-checkin.service';

class FtCheckData {
  @ApiProperty()
  now: FtCheckinDto;
  @ApiProperty()
  max: FtCheckinDto;
}

@ApiTags('ft-checkin')
@Controller('ft-checkin')
export class FtCheckinController {
  constructor(private readonly ftCheckinService: FtCheckinService) {}

  @Get()
  @ApiOperation({ summary: '42checkin api' })
  @ApiOkResponse({
    description: '42체크인 user using api 결과',
    type: FtCheckData,
  })
  async getFtCheckin(): Promise<FtCheckData> {
    try {
      const checkinData = await this.ftCheckinService.fetchData(FT_CHECKIN_KEY);

      const checkinInfo = await this.ftCheckinService.fetchData(MAX_CHECKIN_KEY);

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
