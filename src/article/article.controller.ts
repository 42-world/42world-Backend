import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
  Param,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { FindAllArticleDto } from './dto/find-all-article.dto';
import { Article } from './entities/article.entity';
import { GetUser } from '@root/auth/auth.decorator';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  create(
    @GetUser('id') writer_id: number,
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    return this.articleService.create(writer_id, createArticleDto);
  }

  @Get()
  findAll(@Query() findAllArticle: FindAllArticleDto): Promise<Article[]> {
    return this.articleService.findAll(findAllArticle);
  }

  @Get(':id')
  getOne(@Param('id') id: number): Promise<Article> {
    return this.articleService.getOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @GetUser('id') writer_id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<void> {
    return this.articleService.update(id, writer_id, updateArticleDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: number,
    @GetUser('id') writer_id: number,
  ): Promise<void> {
    return this.articleService.remove(id, writer_id);
  }
}
