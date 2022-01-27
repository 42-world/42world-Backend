import { EntityRepository, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Comment } from '@comment/entities/comment.entity';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  async findAllByArticleId(articleId: number): Promise<Comment[]> {
    return this.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.writer', 'writer')
      .andWhere('comment.article_id = :id', { id: articleId })
      .getMany();
  }

  async existOrFail(id: number): Promise<void> {
    const exist_query = await this.query(`SELECT EXISTS
      (SELECT * FROM comment WHERE id=${id} AND deleted_at IS NULL)`);
    const is_exist = Object.values(exist_query[0])[0];
    if (!is_exist) {
      throw new NotFoundException(`Can't find Comments with id ${id}`);
    }
  }

  findByArticleId(articleId: number): Promise<Comment[]> {
    return this.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.reactionComment', 'reactionComment')
      .andWhere('comment.articleId = :id', { id: articleId })
      .getMany();
  }
}
