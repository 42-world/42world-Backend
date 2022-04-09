import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Comment } from '@api/comment/entities/comment.entity';
import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { getPaginationSkip } from '@api/utils';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  async findAllByArticleId(
    articleId: number,
    options: PaginationRequestDto,
  ): Promise<{
    comments: Comment[];
    totalCount: number;
  }> {
    const query = this.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.writer', 'writer')
      .andWhere('comment.articleId = :id', { id: articleId })
      .skip(getPaginationSkip(options))
      .take(options.take)
      .orderBy('comment.createdAt', options.order);

    const totalCount = await query.getCount();
    const comments = await query.getMany();

    return { comments, totalCount };
  }

  async findAllByWriterId(
    writerId: number,
    options: PaginationRequestDto,
  ): Promise<{
    comments: Comment[];
    totalCount: number;
  }> {
    const query = this.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.article', 'article')
      .leftJoinAndSelect('article.category', 'category')
      .andWhere('comment.writerId = :id', { id: writerId })
      .skip(getPaginationSkip(options))
      .take(options.take)
      .orderBy('comment.createdAt', options.order);

    const totalCount = await query.getCount();
    const comments = await query.getMany();

    return { comments, totalCount };
  }

  async existOrFail(id: number): Promise<void> {
    const existQuery = await this.query(`SELECT EXISTS
      (SELECT * FROM comment WHERE id=${id} AND deleted_at IS NULL)`);
    const isExist = Object.values(existQuery[0])[0];
    if (isExist === '0') {
      throw new NotFoundException(`Can't find Comments with id ${id}`);
    }
  }
}
