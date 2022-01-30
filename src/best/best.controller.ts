import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ConflictException,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Article } from '@root/article/entities/article.entity';
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
  @ApiOperation({ summary: '인기글 추가하기 (관리자)' })
  @ApiOkResponse({ description: '인기글에 추가 성공', type: Best })
  @ApiForbiddenResponse({ description: '접근 권한 없음' })
  @ApiConflictResponse({ description: '이미 인기글에 추가된 글입니다.' })
  async create(@Body() createBestDto: CreateBestDto): Promise<Best> {
    const best = await this.bestService.createOrNot(createBestDto);
    if (!best) {
      throw new ConflictException('이미 인기글에 추가된 글입니다.');
    }
    return best;
  }

  @Get()
  @ApiOperation({ summary: '인기글 가져오기' })
  @ApiOkResponse({ description: '인기글 목록', type: [Article] })
  findAll(@Query() findAllBestDto: FindAllBestDto): Promise<Article[]> {
    return this.bestService.findAll(findAllBestDto);
  }

  @Delete(':id')
  @Admin()
  @ApiOperation({ summary: '인기글에서 내리기 (관리자)' })
  @ApiOkResponse({ description: '인기글 내리기 성공' })
  @ApiForbiddenResponse({ description: '접근 권한 없음' })
  remove(@Param('id') id: number): Promise<void> {
    return this.bestService.remove(id);
  }
}
