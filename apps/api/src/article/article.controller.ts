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
import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { CreateArticleRequestDto } from './dto/request/create-article-request.dto';
import { FindAllArticleRequestDto } from './dto/request/find-all-article-request.dto';
import { SearchArticleRequestDto } from './dto/request/search-article-request.dto';
import { UpdateArticleRequestDto } from './dto/request/update-article-request.dto';
import { ArticleResponseDto } from './dto/response/article-response.dto';
import { CreateArticleResponseDto } from './dto/response/create-article-response.dto';
import { FindOneArticleResponseDto } from './dto/response/find-one-article-response.dto';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('Article')
@Controller('articles')
export class ArticleController {
  constructor(
    @Inject(forwardRef(() => ArticleService))
    private readonly articleService: ArticleService,

    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,

    @Inject(forwardRef(() => ReactionService))
    private readonly reactionService: ReactionService,
  ) {}

  @Post()
  @Auth()
  @ApiOperation({ summary: '게시글 업로드' })
  @ApiCreatedResponse({
    description: '업로드된 게시글',
    type: CreateArticleResponseDto,
  })
  @ApiNotFoundResponse({ description: '존재하지 않는 카테고리' })
  async create(
    @AuthUser() user: User,
    @Body() createArticleDto: CreateArticleRequestDto,
  ): Promise<CreateArticleResponseDto | never> {
    const { article, category } = await this.articleService.create(user, createArticleDto);

    return CreateArticleResponseDto.of({
      article,
      category,
      writer: user,
      user,
    });
  }

  @Get('search')
  @Auth('public')
  @ApiOperation({ summary: '게시글 검색' })
  @ApiPaginatedResponse(ArticleResponseDto)
  async search(
    @AuthUser() user: User,
    @Query() options: SearchArticleRequestDto,
  ): Promise<PaginationResponseDto<ArticleResponseDto>> {
    const { articles, totalCount } = await this.articleService.search(user, options);

    return PaginationResponseDto.of({
      data: ArticleResponseDto.ofArray({ articles, user }),
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
    @Query() options: FindAllArticleRequestDto,
  ): Promise<PaginationResponseDto<ArticleResponseDto>> {
    const { articles, totalCount } = await this.articleService.findAll(user, options);

    return PaginationResponseDto.of({
      data: ArticleResponseDto.ofArray({ articles, user }),
      options,
      totalCount,
    });
  }

  @Get(':id')
  @Auth('public')
  @ApiOperation({ summary: '게시글 상세 가져오기' })
  @ApiOkResponse({
    description: '게시글 상세',
    type: FindOneArticleResponseDto,
  })
  @ApiNotFoundResponse({ description: '존재하지 않는 게시글' })
  async findOne(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) articleId: number,
  ): Promise<FindOneArticleResponseDto | never> {
    const { article, category, writer } = await this.articleService.findOneOrFail(articleId, user);
    let isLike = false;
    if (compareRole(category.reactionable as UserRole, user.role as UserRole))
      isLike = await this.reactionService.isMyReactionArticle(user.id, article.id);

    if (article.writerId !== user.id) this.articleService.increaseViewCount(article.id);
    return FindOneArticleResponseDto.of({
      article,
      category,
      writer,
      isLike,
      user,
    });
  }

  @Get(':id/comments')
  @Auth('public')
  @ApiOperation({ summary: '게시글 댓글 가져오기' })
  @ApiPaginatedResponse(CommentResponseDto)
  async getComments(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) articleId: number,
    @Query() options: PaginationRequestDto,
  ): Promise<PaginationResponseDto<CommentResponseDto> | never> {
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
    @Param('id', ParseIntPipe) id: number,
    @AuthUser('id') writerId: number,
    @Body() updateArticleRequestDto: UpdateArticleRequestDto,
  ): Promise<void | never> {
    return this.articleService.update(id, writerId, updateArticleRequestDto);
  }

  @Delete(':id')
  @Auth()
  @ApiOperation({ summary: '게시글 삭제하기' })
  @ApiOkResponse({ description: '게시글 삭제 완료' })
  @ApiNotFoundResponse({ description: '존재하지 않는 게시글' })
  async remove(@Param('id', ParseIntPipe) id: number, @AuthUser('id') writerId: number): Promise<void | never> {
    return this.articleService.remove(id, writerId);
  }
}
