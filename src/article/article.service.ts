import { Injectable, NotFoundException } from '@nestjs/common';
import { ArticleRepository } from './repositories/article.repository';
import { FindAllArticleDto } from './dto/find-all-article.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(private readonly articleRepository: ArticleRepository) {}

  create(createArticleDto: CreateArticleDto): Promise<Article> {
    const article = this.articleRepository.create(createArticleDto);

    return this.articleRepository.save(article);
  }

  findAll(options?: FindAllArticleDto): Promise<Article[]> {
    return this.articleRepository.findAll(options);
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.articleRepository.findById(id);

    if (!article) {
      throw new NotFoundException(`Can't find Article with id ${id}`);
    }

    return article;
  }

  /**
   * 응답값에 category_id 가 자꾸 문자열로 응답 되는데 왜그럴까요...
   * 그리고 join 을 하지 않아서, findOne 이랑 응답 스키마가 달라요..
   */
  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const article = await this.articleRepository.findOne(id);
    const new_article = {
      ...article,
      ...updateArticleDto,
    };

    return this.articleRepository.save(new_article);
  }

  async remove(id: number): Promise<void> {
    const result = await this.articleRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Article with id ${id}`);
    }
  }
}
