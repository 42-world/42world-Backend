import { EntityRepository, Repository } from 'typeorm';
import { Article } from '@article/entities/article.entity';
import { FindAllArticleRequestDto } from '@root/article/dto/request/find-all-article-request.dto';
import { NotFoundException } from '@nestjs/common';
import { FindAllBestDto } from '@root/best/dto/find-all-best.dto';
import { PaginationRequestDto } from '@root/pagination/dto/pagination-request.dto';
import { PaginationResponseDto } from '@root/pagination/dto/pagination-response.dto';
import { PageMetaDto } from '@root/pagination/dto/page-meta.dto';
import { getPaginationSkip } from '@root/utils';

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

  async findAllBest(options: FindAllBestDto): Promise<Article[]> {
    const query = this.createQueryBuilder('article')
      .leftJoinAndSelect('article.writer', 'writer')
      .leftJoinAndSelect('article.category', 'category')
      .orderBy('article.like_count', 'DESC')
      .addOrderBy('article.created_at', 'DESC');

    if (options.limit) {
      query.limit(options.limit);
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

  async findAllMyArticle(
    userId: number,
    options?: PaginationRequestDto,
  ): Promise<PaginationResponseDto<Article>> {
    const query = this.createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .andWhere('article.writerId = :id', { id: userId })
      .skip(getPaginationSkip(options))
      .take(options.take)
      .orderBy('article.createdAt', options.order);

    const totalCount = await query.getCount();
    const entities = await query.getMany();
    const pageMetaDto = new PageMetaDto(options, totalCount);
    return new PaginationResponseDto(entities, pageMetaDto);
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
