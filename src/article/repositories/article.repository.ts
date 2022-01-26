import { EntityRepository, Repository } from 'typeorm';

import { Article } from '@article/entities/article.entity';
import { FindAllArticleDto } from '@article/dto/find-all-article.dto';

@EntityRepository(Article)
export class ArticleRepository extends Repository<Article> {
  async findAll(options?: FindAllArticleDto): Promise<Article[]> {
    const query = this.createQueryBuilder('article')
      .leftJoinAndSelect('article.writer', 'writer')
      .leftJoinAndSelect('article.category', 'category');

    if (options.categoryId)
      query.andWhere('category.id = :id', { id: options.categoryId });

    return query.getMany();
  }

  async getOneDetailOrFail(id: number): Promise<Article> {
    return this.createQueryBuilder('article')
      .leftJoinAndSelect('article.writer', 'writer')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.reactionArticle', 'reactionArticle')
      .andWhere('article.id = :id', { id })
      .getOneOrFail();
  }
}
