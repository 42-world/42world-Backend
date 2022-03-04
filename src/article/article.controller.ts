import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
  Param,
  ParseIntPipe,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleRequestDto } from './dto/request/create-article-request.dto';
import { UpdateArticleRequestDto } from './dto/request/update-article-request.dto';
import { FindArticleRequestDto } from './dto/request/find-article-request.dto';
import { GetUser } from '@root/auth/auth.decorator';
import { Comment } from '@root/comment/entities/comment.entity';
import { CommentService } from '@root/comment/comment.service';
import {
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DetailCommentDto } from './dto/detail-comment.dto';
import { ReactionService } from '@root/reaction/reaction.service';
import { articleCommentsHelper } from './helper/article.helper';
import { PaginationResponseDto } from '@root/pagination/dto/pagination-response.dto';
import { ApiPaginatedResponse } from '@root/pagination/pagination.decorator';
import { PaginationRequestDto } from '@root/pagination/dto/pagination-request.dto';
import { ArticleResponseDto } from './dto/response/article-response.dto';
import { User } from '@root/user/entities/user.entity';

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
  @ApiOperation({ summary: '게시글 업로드' })
  @ApiOkResponse({
    description: '업로드된 게시글',
    type: ArticleResponseDto,
  })
  @ApiNotFoundResponse({ description: '존재하지 않는 카테고리' })
  async create(
    @GetUser() writer: User,
    @Body() createArticleDto: CreateArticleRequestDto,
  ): Promise<ArticleResponseDto | never> {
    const { article, category } = await this.articleService.create(
      writer.id,
      createArticleDto,
    );

    return ArticleResponseDto.of({
      article,
      category,
      writer,
      isLike: false,
      isSelf: true,
    });
  }

  @Get()
  @ApiOperation({ summary: '게시글 목록' })
  @ApiPaginatedResponse(ArticleResponseDto)
  async findAll(
    @GetUser() user: User,
    @Query() findArticleRequestDto: FindArticleRequestDto,
  ): Promise<PaginationResponseDto<ArticleResponseDto>> {
    const { articles, totalCount } = await this.articleService.findAll(
      findArticleRequestDto,
    );

    return PaginationResponseDto.of({
      data: articles.map((article) =>
        ArticleResponseDto.of({
          article,
          category: article.category,
          writer: article.writer,
          isLike: false,
          isSelf: user.id === article.writerId,
        }),
      ),
      paginationRequestDto: findArticleRequestDto as PaginationRequestDto,
      totalCount,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: '게시글 상세 가져오기' })
  @ApiOkResponse({
    description: '게시글 상세',
    type: ArticleResponseDto,
  })
  @ApiNotFoundResponse({ description: '존재하지 않는 게시글' })
  async findOne(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) articleId: number,
  ): Promise<ArticleResponseDto | never> {
    const { article, category, writer, isLike, isSelf } =
      await this.articleService.findOneOrFail(articleId, userId);

    if (article.writerId !== userId)
      this.articleService.increaseViewCount(article.id);
    return ArticleResponseDto.of({ article, category, writer, isLike, isSelf });
  }

  @Get(':id/comments')
  @ApiOperation({ summary: '게시글 댓글 가져오기' })
  @ApiPaginatedResponse(Comment)
  async getComments(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) articleId: number,
    @Query() pageOptionDto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<DetailCommentDto>> {
    const comments = await this.commentService.findAllByArticleId(
      articleId,
      pageOptionDto,
    );
    const reactionComments =
      await this.reactionService.findAllMyReactionComment(userId, articleId);

    return articleCommentsHelper(comments, reactionComments);
  }

  @Put(':id')
  @ApiOperation({ summary: '게시글 수정하기' })
  @ApiOkResponse({ description: '게시글 수정 완료' })
  @ApiNotFoundResponse({ description: '존재하지 않는 게시글' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') writerId: number,
    @Body() updateArticleRequestDto: UpdateArticleRequestDto,
  ): Promise<void | never> {
    return this.articleService.update(id, writerId, updateArticleRequestDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '게시글 삭제하기' })
  @ApiOkResponse({ description: '게시글 삭제 완료' })
  @ApiNotFoundResponse({ description: '존재하지 않는 게시글' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') writerId: number,
  ): Promise<void | never> {
    return this.articleService.remove(id, writerId);
  }
}
