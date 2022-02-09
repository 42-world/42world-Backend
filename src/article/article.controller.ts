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
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { FindAllArticleDto } from './dto/find-all-article.dto';
import { Article } from './entities/article.entity';
import { GetUser } from '@root/auth/auth.decorator';
import { Comment } from '@root/comment/entities/comment.entity';
import { CommentService } from '@root/comment/comment.service';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DetailCommentDto } from './dto/detail-comment.dto';
import { ReactionService } from '@root/reaction/reaction.service';
import { articleCommentsHelper } from './helper/article.helper';
import { DetailArticleDto } from './dto/detail-article.dto';
import { PageDto } from '@root/pagination/pagination.dto';
import { ApiPaginatedResponse } from '@root/pagination/pagination.decorator';
import { PageOptionsDto } from '@root/pagination/page-options.dto';

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
  @ApiOkResponse({ description: '업로드된 게시글', type: Article })
  create(
    @GetUser('id') writerId: number,
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    return this.articleService.create(writerId, createArticleDto);
  }

  @Get()
  @ApiOperation({ summary: '게시글 목록' })
  @ApiPaginatedResponse(Article)
  findAll(
    @Query() findAllArticle: FindAllArticleDto,
  ): Promise<PageDto<Article>> {
    return this.articleService.findAll(findAllArticle);
  }

  @Get(':id')
  @ApiOperation({ summary: '게시글 상세 가져오기' })
  @ApiOkResponse({ description: '게시글 상세', type: DetailArticleDto })
  async getOne(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) articleId: number,
  ): Promise<DetailArticleDto> {
    const article = await this.articleService.getOneDetail(articleId);
    const isLike = await this.reactionService.isMyReactionArticle(
      userId,
      articleId,
    );
    if (article.writerId !== userId)
      this.articleService.increaseViewCount(article);
    return { ...article, isLike };
  }

  @Get(':id/comments')
  @ApiOperation({ summary: '게시글 댓글 가져오기' })
  @ApiPaginatedResponse(Comment)
  async getComments(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) articleId: number,
    @Query() pageOptionDto: PageOptionsDto,
  ): Promise<PageDto<DetailCommentDto>> {
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') writerId: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<void> {
    return this.articleService.update(id, writerId, updateArticleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '게시글 삭제하기' })
  @ApiOkResponse({ description: '게시글 삭제 완료' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') writerId: number,
  ): Promise<void> {
    return this.articleService.remove(id, writerId);
  }
}
