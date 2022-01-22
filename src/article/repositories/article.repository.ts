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

  async getOneOrFail(id: number): Promise<Article> {
    return this.createQueryBuilder('article')
      .leftJoinAndSelect('article.writer', 'writer')
      .leftJoinAndSelect('article.category', 'category')
      .andWhere('article.id = :id', { id })
      .getOneOrFail();
  }

  async isExistById(id: number): Promise<boolean> {
    const exist_query = await this.query(`SELECT EXISTS
		(SELECT * FROM article WHERE id=${id} deleted_at IS NULL)`);
    const is_exist = Object.values(exist_query[0])[0];
    return is_exist == 1 ? true : false;
  }
}
