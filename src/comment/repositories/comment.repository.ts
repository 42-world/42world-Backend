import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Comment } from '@comment/entities/comment.entity';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  async findAllByArticleId(articleId: number): Promise<Comment[]> {
    return this.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.writer', 'writer')
      .andWhere('comment.articleId = :id', { id: articleId })
      .orderBy('comment.created_at')
      .getMany();
  }

  async existOrFail(id: number): Promise<void> {
    const exist_query = await this.query(`SELECT EXISTS
      (SELECT * FROM comment WHERE id=${id} AND deleted_at IS NULL)`);
    const is_exist = Object.values(exist_query[0])[0];
    if (is_exist === '0') {
      throw new NotFoundException(`Can't find Comments with id ${id}`);
    }
  }

  async findAllMyComment(userId: number): Promise<Comment[]> {
    return this.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.article', 'article')
      .leftJoinAndSelect('article.category', 'category')
      .andWhere('comment.writerId = :id', { id: userId })
      .getMany();
  }
}
