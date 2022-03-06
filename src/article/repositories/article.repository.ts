import { EntityRepository, Repository } from 'typeorm';

import { Article } from '@article/entities/article.entity';
import { FindAllArticleDto } from '@article/dto/find-all-article.dto';
import { NotFoundException } from '@nestjs/common';
import { FindAllBestDto } from '@root/best/dto/find-all-best.dto';
import { PageDto } from '@root/pagination/pagination.dto';
import { PageMetaDto } from '@root/pagination/page-meta.dto';
import { PageOptionsDto } from '@root/pagination/page-options.dto';

@EntityRepository(Article)
export class ArticleRepository extends Repository<Article> {
  async findAll(options?: FindAllArticleDto): Promise<PageDto<Article>> {
    const query = this.createQueryBuilder('article')
      .leftJoinAndSelect('article.writer', 'writer')
      .leftJoinAndSelect('article.category', 'category')
      .skip(options.skip)
      .take(options.take)
      .orderBy('article.createdAt', options.order);

    if (options.categoryId)
      query.andWhere('category.id = :id', { id: options.categoryId });

    const totalCount = await query.getCount();
    const entities = await query.getMany();
    const pageMetaDto = new PageMetaDto({
      totalCount,
      pageOptionsDto: options,
    });

    return new PageDto(entities, pageMetaDto);
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

  async getOneDetailOrFail(id: number): Promise<Article> {
    return this.createQueryBuilder('article')
      .leftJoinAndSelect('article.writer', 'writer')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.reactionArticle', 'reactionArticle')
      .andWhere('article.id = :id', { id })
      .getOneOrFail();
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
    options?: PageOptionsDto,
  ): Promise<PageDto<Article>> {
    const query = this.createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .andWhere('article.writerId = :id', { id: userId })
      .skip(options.skip)
      .take(options.take)
      .orderBy('article.createdAt', options.order);

    const totalCount = await query.getCount();
    const entities = await query.getMany();
    const pageMetaDto = new PageMetaDto({
      totalCount,
      pageOptionsDto: options,
    });
    return new PageDto(entities, pageMetaDto);
  }
}
