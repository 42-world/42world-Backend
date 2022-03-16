import { PageMetaDto } from '@root/pagination/dto/page-meta.dto';
import { PaginationRequestDto } from '@root/pagination/dto/pagination-request.dto';
import { PaginationResponseDto } from '@root/pagination/dto/pagination-response.dto';
import { getPaginationSkip } from '@root/utils';
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
    options?: PaginationRequestDto,
  ): Promise<PaginationResponseDto<ReactionArticle>> {
    const query = this.createQueryBuilder('reactionArticle')
      .leftJoinAndSelect('reactionArticle.article', 'article')
      .leftJoinAndSelect('article.category', 'category')
      .andWhere('reactionArticle.userId = :id', { id: userId })
      .skip(getPaginationSkip(options))
      .take(options.take)
      .orderBy('reactionArticle.createdAt', options.order);

    const totalCount = await query.getCount();
    const entities = await query.getMany();
    const pageMetaDto = new PageMetaDto(options, totalCount);
    return new PaginationResponseDto(entities, pageMetaDto);
  }
}
