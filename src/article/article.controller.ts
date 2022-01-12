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

/**
 * 제가 아직 nest 에 안익숙해서 모든 함수에 return type 을 명시했습니다...
 * 마찬가지로 경로도 명시적으로 표시해뒀습니다...
 */
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  /**\
   * 존재하지 않는 writer나 category 를 넣어도 잘 들어가네요
   * validate 를 해야할거같아요
   */
  @Post('/')
  create(@Body() createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articleService.create(createArticleDto);
  }

  @Get('/')
  findAll(@Query() findAllArticle: FindAllArticleDto): Promise<Article[]> {
    return this.articleService.findAll(findAllArticle);
  }

  @Get('/:id')
  findOen(@Param('id') id: number): Promise<Article> {
    return this.articleService.findOne(id);
  }

  @Put('/:id')
  update(
    @Param('id') id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    return this.articleService.update(id, updateArticleDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: number): Promise<void> {
    return this.articleService.remove(id);
  }
}
