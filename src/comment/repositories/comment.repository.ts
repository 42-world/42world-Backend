import { EntityRepository, Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  async findAllByArticleId(articleId: number): Promise<Comment[]> {
    return this.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.writer', 'writer')
      .andWhere('comment.article_id = :id', { id: articleId })
      .getMany();
  }
}
