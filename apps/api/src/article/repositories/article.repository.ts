import { FindAllArticleRequestDto } from '@api/article/dto/request/find-all-article-request.dto';
import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { Article } from '@app/entity/article/article.entity';
import { getPaginationSkip } from '@app/utils/utils';
import { NotFoundException } from '@nestjs/common';
import { Brackets, EntityRepository, Repository } from 'typeorm';
import { SearchArticleRequestDto } from '../dto/request/search-article-request.dto';

@EntityRepository(Article)
export class ArticleRepository extends Repository<Article> {
  async findAll(options: FindAllArticleRequestDto): Promise<{
    articles: Article[];
    totalCount: number;
  }> {
    const query = this.createQueryBuilder('article')
      .leftJoinAndSelect('article.writer', 'writer')
      .leftJoinAndSelect('article.category', 'category')
      .skip(getPaginationSkip(options))
      .take(options.take)
      .where('category_id = :id', { id: options.categoryId })
      .orderBy('article.createdAt', options.order);

    const totalCount = await query.getCount();
    const articles = await query.getMany();

    return { articles, totalCount };
  }

  async search(
    options: SearchArticleRequestDto,
    categoryIds: number[],
  ): Promise<{
    articles: Article[];
    totalCount: number;
  }> {
    const query = this.createQueryBuilder('article')
      .leftJoinAndSelect('article.writer', 'writer')
      .leftJoinAndSelect('article.category', 'category')
      .where('category_id IN (:...ids)', {
        ids: categoryIds,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where('article.title like :q', { q: `%${options.q}%` }).orWhere('article.content like :q', {
            q: `%${options.q}%`,
          });
        }),
      )
      .skip(getPaginationSkip(options))
      .take(options.take)
      .orderBy('article.createdAt', options.order);

    const totalCount = await query.getCount();
    const articles = await query.getMany();

    return { articles, totalCount };
  }

  async findAllByWriterId(
    writerId: number,
    options: PaginationRequestDto,
  ): Promise<{
    articles: Article[];
    totalCount: number;
  }> {
    const query = this.createQueryBuilder('article')
      .leftJoinAndSelect('article.writer', 'writer')
      .leftJoinAndSelect('article.category', 'category')
      .andWhere('article.writerId = :id', { id: writerId })
      .skip(getPaginationSkip(options))
      .take(options.take)
      .orderBy('article.createdAt', options.order);

    const totalCount = await query.getCount();
    const articles = await query.getMany();

    return { articles, totalCount };
  }

  async findAllBest(options: PaginationRequestDto): Promise<Article[]> {
    const WEEK = 7 * 24 * 60 * 60 * 1000;
    const query = this.createQueryBuilder('article')
      .leftJoinAndSelect('article.writer', 'writer')
      .leftJoinAndSelect('article.category', 'category')
      .orderBy('article.like_count', 'DESC')
      .addOrderBy('article.created_at', 'DESC')
      .andWhere('article.created_at >= :week_2', {
        week_2: new Date(new Date().getTime() - 2 * WEEK),
      });

    if (options.take) {
      query.limit(options.take);
    }

    return query.getMany();
  }

  async existOrFail(id: number): Promise<void> {
    const existQuery = await this.query(`SELECT EXISTS
		(SELECT * FROM article WHERE id=${id} AND deleted_at IS NULL)`);
    const isExist = Object.values(existQuery[0])[0];
    if (isExist === '0') {
      throw new NotFoundException(`Can't find Article with id ${id}`);
    }
  }
}
