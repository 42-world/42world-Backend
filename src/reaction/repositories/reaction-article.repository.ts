import { PageMetaDto } from '@root/pagination/page-meta.dto';
import { PageOptionsDto } from '@root/pagination/page-options.dto';
import { PageDto } from '@root/pagination/pagination.dto';
import { EntityRepository, Repository } from 'typeorm';
import {
  ReactionArticle,
  ReactionArticleType,
} from '../entities/reaction-article.entity';

@EntityRepository(ReactionArticle)
export class ReactionArticleRepository extends Repository<ReactionArticle> {
  async isExist(
    userId: number,
    articleId: number,
    type: ReactionArticleType,
  ): Promise<boolean> {
    const existQuery = await this.query(`SELECT EXISTS
      (SELECT * FROM reaction_article WHERE user_id=${userId} AND article_id=${articleId} AND type='${type}')`);
    return Object.values(existQuery[0])[0] === '1';
  }

  async findAllArticleByUserId(
    userId: number,
    options?: PageOptionsDto,
  ): Promise<PageDto<ReactionArticle>> {
    const query = this.createQueryBuilder('reactionArticle')
      .leftJoinAndSelect('reactionArticle.article', 'article')
      .leftJoinAndSelect('article.category', 'category')
      .andWhere('reactionArticle.userId = :id', { id: userId })
      .skip(options.skip)
      .take(options.take)
      .orderBy('reactionArticle.createdAt', options.order);

    const totalCount = await query.getCount();
    const entities = await query.getMany();
    const pageMetaDto = new PageMetaDto({
      totalCount,
      pageOptionsDto: options,
    });
    return new PageDto(entities, pageMetaDto);
  }
}
