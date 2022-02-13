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

  async findAllArticleByUserId(userId: number): Promise<ReactionArticle[]> {
    return this.createQueryBuilder('reactionArticle')
      .leftJoinAndSelect('reactionArticle.article', 'article')
      .leftJoinAndSelect('article.category', 'category')
      .andWhere('reactionArticle.userId = :id', { id: userId })
      .getMany();
  }
}
