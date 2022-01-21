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

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('Article')
@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly commentService: CommentService,
  ) {}

  @Post()
  @ApiOperation({ summary: '게시글 업로드' })
  @ApiOkResponse({ description: '업로드된 게시글', type: Article })
  create(
    @GetUser('id') writer_id: number,
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    return this.articleService.create(writer_id, createArticleDto);
  }

  @Get()
  @ApiOperation({ summary: '게시글 검색' })
  @ApiOkResponse({ description: '게시글 들', type: [Article] })
  findAll(@Query() findAllArticle: FindAllArticleDto): Promise<Article[]> {
    return this.articleService.findAll(findAllArticle);
  }

  @Get(':id')
  @ApiOperation({ summary: '게시글 상세 가져오기' })
  @ApiOkResponse({ description: '게시글 상세', type: Article })
  getOne(@Param('id', ParseIntPipe) id: number): Promise<Article> {
    return this.articleService.getOne(id);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: '게시글 댓글 가져오기' })
  @ApiOkResponse({ description: '게시글 댓글들', type: [Comment] })
  getComments(@Param('id', ParseIntPipe) id: number): Promise<Comment[]> {
    return this.commentService.getByArticleId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '게시글 수정하기' })
  @ApiOkResponse({ description: '게시글 수정 완료' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') writer_id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<void> {
    return this.articleService.update(id, writer_id, updateArticleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '게시글 삭제하기' })
  @ApiOkResponse({ description: '게시글 삭제 완료' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') writer_id: number,
  ): Promise<void> {
    return this.articleService.remove(id, writer_id);
  }
}
