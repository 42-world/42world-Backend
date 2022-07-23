import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { ReactionArticle, ReactionArticleType } from '@app/entity/reaction/reaction-article.entity';
import { getPaginationSkip } from '@app/utils/utils';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ReactionArticle)
export class ReactionArticleRepository extends Repository<ReactionArticle> {
  async isExist(userId: number, articleId: number, type: ReactionArticleType): Promise<boolean> {
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
      .innerJoinAndSelect('reactionArticle.article', 'article')
      .leftJoinAndSelect('article.writer', 'writer')
      .leftJoinAndSelect('article.category', 'category')
      .where('reactionArticle.userId = :id', { id: userId })
      .skip(getPaginationSkip(options))
      .take(options.take)
      .orderBy('reactionArticle.createdAt', options.order);

    const likeArticles = await query.getMany();
    const totalCount = await query.getCount();

    return { likeArticles, totalCount };
  }
}
