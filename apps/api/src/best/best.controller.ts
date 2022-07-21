import { Auth } from '@api/auth/auth.decorator';
import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { Article } from '@app/entity/article/article.entity';
import { Best } from '@app/entity/best/best.entity';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { Body, ConflictException, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BestService } from './best.service';
import { CreateBestRequestDto } from './dto/request/create-best-request.dto';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('Best')
@Controller('best')
export class BestController {
  constructor(private readonly bestService: BestService) {}

  @Post()
  @Auth('allow', UserRole.ADMIN)
  @ApiOperation({ summary: '인기글 추가하기 (관리자)' })
  @ApiOkResponse({ description: '인기글에 추가 성공', type: Best })
  @ApiForbiddenResponse({ description: '접근 권한 없음' })
  @ApiConflictResponse({ description: '이미 인기글에 추가된 글입니다.' })
  async create(@Body() createBestDto: CreateBestRequestDto): Promise<Best | never> {
    const best = await this.bestService.createOrNot(createBestDto);
    if (!best) {
      throw new ConflictException('이미 인기글에 추가된 글입니다.');
    }
    return best;
  }

  @Get()
  @ApiOperation({ summary: '인기글 가져오기' })
  @ApiOkResponse({ description: '인기글 목록', type: [Article] })
  async findAll(@Query() findAllBestDto: PaginationRequestDto): Promise<Article[]> {
    return this.bestService.findAll(findAllBestDto);
  }

  @Delete(':id')
  @Auth('allow', UserRole.ADMIN)
  @ApiOperation({ summary: '인기글에서 내리기 (관리자)' })
  @ApiOkResponse({ description: '인기글 내리기 성공' })
  @ApiForbiddenResponse({ description: '접근 권한 없음' })
  @ApiNotFoundResponse({ description: '존재하지 않는 인기글입니다.' })
  async remove(@Param('id') id: number): Promise<void | never> {
    return this.bestService.remove(id);
  }
}
