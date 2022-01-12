import { EntityRepository, Repository } from 'typeorm';

import { Article } from '@article/entities/article.entity';
import { FindAllArticleDto } from '@article/dto/find-all-article.dto';

@EntityRepository(Article)
export class ArticleRepository extends Repository<Article> {
  async findAll(options?: FindAllArticleDto) {
    const query = this.createQueryBuilder('article')
      .leftJoinAndSelect('article.writer', 'writer')
      .leftJoinAndSelect('article.category', 'category');

    if (options.categoryName)
      query.andWhere('category.name = :name', { name: options.categoryName });

    return query.getMany();
  }
}
