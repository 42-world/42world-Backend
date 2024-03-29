import { Auth, AuthUser } from '@api/auth/auth.decorator';
import { PaginationResponseDto } from '@api/pagination/dto/pagination-response.dto';
import { ApiPaginatedResponse } from '@api/pagination/pagination.decorator';
import { User } from '@app/entity/user/user.entity';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  ArticleDtoMapper,
  ArticleResponseDto,
  CreateArticleRequestDto,
  FindAllArticleRequestDto,
  SearchArticleRequestDto,
  UpdateArticleRequestDto,
} from './dto';
import {
  CreateArticleApiService,
  FindArticleApiService,
  RemoveArticleApiService,
  SearchArticleApiService,
  UpdateArticleApiService,
} from './service';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('Article')
@Controller('articles')
export class ArticleApiController {
  constructor(
    private readonly createArticleApiService: CreateArticleApiService,
    private readonly findArticleApiService: FindArticleApiService,
    private readonly updateArticleApiService: UpdateArticleApiService,
    private readonly searchArticleApiService: SearchArticleApiService,
    private readonly removeArticleApiService: RemoveArticleApiService,
  ) {}

  @Post()
  @Auth()
  @ApiOperation({ summary: '게시글 업로드' })
  @ApiCreatedResponse({ description: '업로드된 게시글', type: ArticleResponseDto })
  @ApiNotFoundResponse({ description: '존재하지 않는 카테고리' })
  async create(
    @AuthUser() user: User,
    @Body() { title, content, categoryId }: CreateArticleRequestDto,
  ): Promise<ArticleResponseDto> {
    const article = await this.createArticleApiService.create(user, title, content, categoryId);

    return ArticleDtoMapper.toResponseDto({ article, user });
  }

  // TODO: categoryId 가 없고, options가 있는경우 실제로 값이 어떻게 넘어가는지 확인할것
  @Get('search')
  @Auth('public')
  @ApiOperation({ summary: '게시글 검색' })
  @ApiPaginatedResponse(ArticleResponseDto)
  async search(
    @AuthUser() user: User,
    @Query() { q, categoryId, ...options }: SearchArticleRequestDto,
  ): Promise<PaginationResponseDto<ArticleResponseDto>> {
    const { articles, totalCount } = await this.searchArticleApiService.search(user, q, categoryId, options);

    return PaginationResponseDto.of({
      data: ArticleDtoMapper.toResponseDtoList({ articles, user }),
      options,
      totalCount,
    });
  }

  @Get()
  @Auth('public')
  @ApiOperation({ summary: '게시글 목록' })
  @ApiPaginatedResponse(ArticleResponseDto)
  async findAll(
    @AuthUser() user: User,
    @Query() { categoryId, ...options }: FindAllArticleRequestDto,
  ): Promise<PaginationResponseDto<ArticleResponseDto>> {
    const { articles, totalCount } = await this.findArticleApiService.findAllByCategoryId(user, categoryId, options);

    return PaginationResponseDto.of({
      data: ArticleDtoMapper.toResponseDtoList({ articles, user }),
      options,
      totalCount,
    });
  }

  @Get(':id')
  @Auth('public')
  @ApiOperation({ summary: '게시글 상세 가져오기' })
  @ApiOkResponse({ description: '게시글 상세', type: ArticleResponseDto })
  @ApiNotFoundResponse({ description: '존재하지 않는 게시글' })
  async findOne(
    @AuthUser() user: User, //
    @Param('id', ParseIntPipe) articleId: number,
  ): Promise<ArticleResponseDto> {
    const { article, isLike } = await this.findArticleApiService.findOneById(user, articleId);

    return ArticleDtoMapper.toResponseDto({ article, user, isLike });
  }

  @Put(':id')
  @Auth()
  @ApiOperation({ summary: '게시글 수정하기' })
  @ApiOkResponse({ description: '게시글 수정 완료' })
  @ApiNotFoundResponse({ description: '존재하지 않는 게시글' })
  async update(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() { title, content, categoryId }: UpdateArticleRequestDto,
  ): Promise<void> {
    return this.updateArticleApiService.update(user, id, title, content, categoryId);
  }

  @Delete(':id')
  @Auth()
  @ApiOperation({ summary: '게시글 삭제하기' })
  @ApiOkResponse({ description: '게시글 삭제 완료' })
  @ApiNotFoundResponse({ description: '존재하지 않는 게시글' })
  async remove(
    @AuthUser() user: User, //
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.removeArticleApiService.remove(user, id);
  }
}
