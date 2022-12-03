import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { Article } from '@app/entity/article/article.entity';
import { getPaginationSkip } from '@app/utils/utils';
import { Brackets, EntityRepository, Repository } from 'typeorm';

@EntityRepository(Article)
export class ArticleRepository extends Repository<Article> {
  async findAllByCategoryId(
    categoryId: number,
    options: PaginationRequestDto,
  ): Promise<{
    articles: Article[];
    totalCount: number;
  }> {
    const query = this.createQueryBuilder('article')
      .leftJoinAndSelect('article.writer', 'writer')
      .leftJoinAndSelect('article.category', 'category')
      .skip(getPaginationSkip(options))
      .take(options.take)
      .where('category_id = :id', { id: categoryId })
      .orderBy('article.createdAt', options.order);

    const totalCount = await query.getCount();
    const articles = await query.getMany();

    return { articles, totalCount };
  }

  async search(
    q: string,
    categoryIds: number[],
    options: PaginationRequestDto,
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
          qb.where('article.title like :q', { q: `%${q}%` }).orWhere(
            'regexp_replace(`article`.`content`, "!\\[[[:print:]]+\\]\\([[:print:]]+\\)", "") like :q',
            {
              q: `%${q}%`,
            },
          );
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
}
