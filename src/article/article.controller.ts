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

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articleService.create(createArticleDto);
  }

  @Get()
  getAll(@Query() findAllArticle: FindAllArticleDto): Promise<Article[]> {
    return this.articleService.getAll(findAllArticle);
  }

  @Get(':id')
  getOne(@Param('id') id: number): Promise<Article> {
    return this.articleService.getOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    return this.articleService.update(id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.articleService.remove(id);
  }
}
