import { FindAllArticleRequestDto } from '@api/article/dto/request/find-all-article-request.dto';
import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { Article } from '@app/entity/article/article.entity';
import { getPaginationSkip } from '@app/utils/utils';
import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Article)
export class ArticleRepository extends Repository<Article> {
  async findAll(options: FindAllArticleRequestDto): Promise<{
    articles: Article[];
    totalCount: number;
  }> {
    const query = this.createQueryBuilder('article')
      .leftJoinAndSelect('article.writer', 'writer')
      .skip(getPaginationSkip(options))
      .take(options.take)
      .where('category_id = :id', { id: options.categoryId })
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
    const query = this.createQueryBuilder('article')
      .leftJoinAndSelect('article.writer', 'writer')
      .leftJoinAndSelect('article.category', 'category')
      .orderBy('article.like_count', 'DESC')
      .addOrderBy('article.created_at', 'DESC')
      .andWhere('article.created_at >= :week_2', {
        week_2: new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000),
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

  async increaseViewCount(id: number): Promise<void> {
    await this.query(
      `UPDATE article SET view_count = view_count + 1 WHERE id=${id}`,
    );
  }

  async increaseCommentCount(id: number): Promise<void> {
    await this.query(
      `UPDATE article SET comment_count = comment_count + 1 WHERE id=${id}`,
    );
  }

  async decreaseCommentCount(id: number): Promise<void> {
    await this.query(
      `UPDATE article SET comment_count = comment_count - 1 WHERE id=${id}`,
    );
  }

  async increaseLikeCount(id: number): Promise<void> {
    await this.query(
      `UPDATE article SET like_count = like_count + 1 WHERE id=${id}`,
    );
  }

  async decreaseLikeCount(id: number): Promise<void> {
    await this.query(
      `UPDATE article SET like_count = like_count - 1 WHERE id=${id}`,
    );
  }
}
