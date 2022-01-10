import { Controller, Get, Query } from '@nestjs/common';
import { ArticleService } from './article.service';
import { FindAllArticleDto } from './dto/find-all-article.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  findAll(@Query() findAllArticle: FindAllArticleDto) {
    return this.articleService.findAll(findAllArticle);
  }
}
