import { FindAllArticleResponseDto } from '@api/article/dto/response/find-all-article-response.dto';
import { AlsoNovice, GetUser } from '@api/auth/auth.decorator';
import { PaginationResponseDto } from '@api/pagination/dto/pagination-response.dto';
import { Category } from '@app/entity/category/category.entity';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';
import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SearchAllRequestDto } from './dto/request/search-all-request.dto';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('Search')
@Controller('search')
export class SearchController {
  @Get()
  @HttpCode(200)
  @AlsoNovice()
  @ApiOperation({ summary: '전체 게시글 검색' })
  async searchAll(
    @GetUser() user: User,
    @Query() options: SearchAllRequestDto,
  ): Promise<PaginationResponseDto<FindAllArticleResponseDto>> {
    console.log('GET /search');

    const articles = [];
    const category = new Category();
    category.name = 'name';
    category.readableArticle = UserRole.CADET;
    category.writableArticle = UserRole.CADET;
    category.readableComment = UserRole.CADET;
    category.writableComment = UserRole.CADET;
    category.reactionable = UserRole.CADET;
    category.anonymity = false;
    const totalCount = 0;

    return PaginationResponseDto.of({
      data: FindAllArticleResponseDto.of({ articles, category, user }),
      options,
      totalCount,
    });
  }
}
