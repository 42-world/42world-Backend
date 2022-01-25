import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Admin } from '@root/auth/auth.decorator';
import { BestService } from './best.service';
import { CreateBestDto } from './dto/create-best.dto';
import { FindAllBestDto } from './dto/find-all-best.dto';
import { Best } from './entities/best.entity';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('Best')
@Controller('best')
export class BestController {
  constructor(private readonly bestService: BestService) {}

  @Post()
  @Admin()
  @ApiOperation({ summary: '인기글 추가하기' })
  @ApiOkResponse({ description: '인기글에 추가 성공', type: Best })
  @ApiConflictResponse({ description: '이미 인기글에 추가된 글입니다.' })
  create(@Body() createBestDto: CreateBestDto): Promise<Best> {
    return this.bestService.create(createBestDto);
  }

  @Get()
  @ApiOperation({ summary: '인기글 가져오기' })
  @ApiOkResponse({ description: '인기글 목록', type: [Best] })
  findAll(@Query() findAllBestDto: FindAllBestDto): Promise<Best[]> {
    return this.bestService.findAll(findAllBestDto);
  }

  @Delete(':id')
  @Admin()
  @ApiOperation({ summary: '인기글에서 내리기' })
  @ApiOkResponse({ description: '인기글 내리기 성공' })
  remove(@Param('id') id: number): Promise<void> {
    return this.bestService.remove(id);
  }
}
