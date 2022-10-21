import { ArticleDtoMapper } from '@api/article/dto/article.mapper';
import { SearchArticleRequestDto } from '@api/article/dto/request/search-article-request.dto';
import { Auth, AuthUser } from '@api/auth/auth.decorator';
import { CommentService } from '@api/comment/comment.service';
import { CommentResponseDto } from '@api/comment/dto/response/comment-response.dto';
import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { PaginationResponseDto } from '@api/pagination/dto/pagination-response.dto';
import { ApiPaginatedResponse } from '@api/pagination/pagination.decorator';
import { ReactionService } from '@api/reaction/reaction.service';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';
import { compareRole } from '@app/utils/utils';
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
import { ArticleApiService } from './article-api.service';
import { CreateArticleRequestDto } from './dto/request/create-article-request.dto';
import { FindAllArticleRequestDto } from './dto/request/find-all-article-request.dto';
import { UpdateArticleRequestDto } from './dto/request/update-article-request.dto';
import { ArticleResponseDto } from './dto/response/article-response.dto';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('Article')
@Controller('articles')
export class ArticleApiController {
  constructor(
    private readonly articleApiService: ArticleApiService,
    private readonly commentService: CommentService,
    private readonly reactionService: ReactionService,
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
    const article = await this.articleApiService.create(user, title, content, categoryId);

    return ArticleDtoMapper.toResponseDto({ article, user });
  }

  @Get('search')
  @Auth('public')
  @ApiOperation({ summary: '게시글 검색' })
  @ApiPaginatedResponse(ArticleResponseDto)
  async search(
    @AuthUser() user: User,
    @Query() { q, categoryId, ...options }: SearchArticleRequestDto,
  ): Promise<PaginationResponseDto<ArticleResponseDto>> {
    const { articles, totalCount } = await this.articleApiService.search(user, q, categoryId, options);

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
    const { articles, totalCount } = await this.articleApiService.findAllByCategoryId(user, categoryId, options);

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
    const article = await this.articleApiService.findOneById(user, articleId);
    const isLike = await this.reactionService.isMyReactionArticle(user.id, article.id);

    return ArticleDtoMapper.toResponseDto({ article, user, isLike });
  }

  @Get(':id/comments')
  @Auth('public')
  @ApiOperation({ summary: '게시글 댓글 가져오기' })
  @ApiPaginatedResponse(CommentResponseDto)
  async getComments(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) articleId: number,
    @Query() options: PaginationRequestDto,
  ): Promise<PaginationResponseDto<CommentResponseDto>> {
    const { comments, category, totalCount } = await this.commentService.findAllByArticleId(user, articleId, options);
    let reactionComments = [];
    if (compareRole(category.reactionable as UserRole, user.role as UserRole))
      reactionComments = await this.reactionService.findAllMyReactionComment(user.id, articleId);

    return PaginationResponseDto.of({
      data: CommentResponseDto.ofArray({
        comments,
        reactionComments,
        userId: user.id,
        isAnonymous: category.anonymity,
      }),
      options,
      totalCount,
    });
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
    return this.articleApiService.update(user, id, title, content, categoryId);
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
    return this.articleApiService.remove(user, id);
  }
}
