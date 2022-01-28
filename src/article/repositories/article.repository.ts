import { EntityRepository, Repository } from 'typeorm';

import { Article } from '@article/entities/article.entity';
import { FindAllArticleDto } from '@article/dto/find-all-article.dto';
import { NotFoundException } from '@nestjs/common';

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

  async existOrFail(id: number): Promise<void> {
    const exist_query = await this.query(`SELECT EXISTS
		(SELECT * FROM article WHERE id=${id} AND deleted_at IS NULL)`);
    const is_exist = Object.values(exist_query[0])[0];
    if (is_exist === '0') {
      throw new NotFoundException(`Can't find Article with id ${id}`);
    }

  async findAllMyArticle(userId: number): Promise<Article[]> {
    return this.createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .andWhere('article.writerId = :id', { id: userId })
      .getMany();
  }
}
