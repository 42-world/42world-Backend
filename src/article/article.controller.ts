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
import { FindAllArticleRequestDto } from './dto/request/find-all-article-request.dto';
import { AlsoNovice, GetUser } from '@root/auth/auth.decorator';
import { CommentService } from '@root/comment/comment.service';
import {
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReactionService } from '@root/reaction/reaction.service';
import { PaginationResponseDto } from '@root/pagination/dto/pagination-response.dto';
import { ApiPaginatedResponse } from '@root/pagination/pagination.decorator';
import { PaginationRequestDto } from '@root/pagination/dto/pagination-request.dto';
import { User } from '@root/user/entities/user.entity';
import { CommentResponseDto } from '../comment/dto/response/comment-response.dto';
import { FindOneArticleResponseDto } from './dto/response/find-one-article-response.dto';
import { FindAllArticleResponseDto } from './dto/response/find-all-article-response.dto';
import { CreateArticleResponseDto } from './dto/response/create-article-response.dto';

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
  @AlsoNovice()
  @ApiOperation({ summary: '게시글 업로드' })
  @ApiOkResponse({
    description: '업로드된 게시글',
    type: CreateArticleResponseDto,
  })
  @ApiNotFoundResponse({ description: '존재하지 않는 카테고리' })
  async create(
    @GetUser() user: User,
    @Body() createArticleDto: CreateArticleRequestDto,
  ): Promise<CreateArticleResponseDto | never> {
    const { article, category } = await this.articleService.create(
      user,
      createArticleDto,
    );

    return CreateArticleResponseDto.of({
      article,
      category,
      writer: user,
      user,
    });
  }

  @Get()
  @AlsoNovice()
  @ApiOperation({ summary: '게시글 목록' })
  @ApiPaginatedResponse(FindAllArticleResponseDto)
  async findAll(
    @GetUser() user: User,
    @Query() options: FindAllArticleRequestDto,
  ): Promise<PaginationResponseDto<FindAllArticleResponseDto>> {
    const { articles, totalCount } = await this.articleService.findAll(
      user,
      options,
    );

    return PaginationResponseDto.of({
      data: FindAllArticleResponseDto.of({ articles, user }),
      options,
      totalCount,
    });
  }

  @Get(':id')
  @AlsoNovice()
  @ApiOperation({ summary: '게시글 상세 가져오기' })
  @ApiOkResponse({
    description: '게시글 상세',
    type: FindOneArticleResponseDto,
  })
  @ApiNotFoundResponse({ description: '존재하지 않는 게시글' })
  async findOne(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) articleId: number,
  ): Promise<FindOneArticleResponseDto | never> {
    const { article, category, writer, isLike } =
      await this.articleService.findOneOrFail(articleId, user);

    if (article.writerId !== user.id)
      this.articleService.increaseViewCount(article.id);
    return FindOneArticleResponseDto.of({
      article,
      category,
      writer,
      isLike,
      user,
    });
  }

  @Get(':id/comments')
  @ApiOperation({ summary: '게시글 댓글 가져오기' })
  @ApiPaginatedResponse(CommentResponseDto)
  async getComments(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) articleId: number,
    @Query() options: PaginationRequestDto,
  ): Promise<PaginationResponseDto<CommentResponseDto> | never> {
    const { comments, totalCount } =
      await this.commentService.findAllByArticleId(articleId, options);
    const reactionComments =
      await this.reactionService.findAllMyReactionComment(userId, articleId);

    return PaginationResponseDto.of({
      data: CommentResponseDto.ofArray({
        comments,
        reactionComments,
        userId,
      }),
      options,
      totalCount,
    });
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
