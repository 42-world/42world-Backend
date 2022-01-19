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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { FindAllArticleDto } from './dto/find-all-article.dto';
import { Article } from './entities/article.entity';
import { GetUser } from '@root/auth/auth.decorator';
import { Comment } from '@root/comment/entities/comment.entity';
import { CommentService } from '@root/comment/comment.service';

@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly commentService: CommentService,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(
    @GetUser('id') writer_id: number,
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    return this.articleService.create(writer_id, createArticleDto);
  }

  @Get()
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  findAll(@Query() findAllArticle: FindAllArticleDto): Promise<Article[]> {
    return this.articleService.findAll(findAllArticle);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): Promise<Article> {
    return this.articleService.getOne(id);
  }

  @Get(':id/comments')
  getComments(@Param('id', ParseIntPipe) id: number): Promise<Comment[]> {
    return this.commentService.getByArticleId(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') writer_id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<void> {
    return this.articleService.update(id, writer_id, updateArticleDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') writer_id: number,
  ): Promise<void> {
    return this.articleService.remove(id, writer_id);
  }
}
