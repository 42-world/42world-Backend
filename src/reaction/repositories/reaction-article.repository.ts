import { PaginationRequestDto } from '@root/pagination/dto/pagination-request.dto';
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
    options: PaginationRequestDto,
  ): Promise<{
    likeArticles: ReactionArticle[];
    totalCount: number;
  }> {
    const query = this.createQueryBuilder('reactionArticle')
      .leftJoinAndSelect('reactionArticle.article', 'article')
      .leftJoinAndSelect('article.writer', 'writer')
      .leftJoinAndSelect('article.category', 'category')
      .andWhere('reactionArticle.userId = :id', { id: userId })
      .skip(options.skip)
      .take(options.take)
      .orderBy('reactionArticle.createdAt', options.order);

    const likeArticles = await query.getMany();
    const totalCount = await query.getCount();

    return { likeArticles, totalCount };
  }
}
