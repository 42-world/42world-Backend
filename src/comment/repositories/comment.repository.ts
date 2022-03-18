import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Comment } from '@comment/entities/comment.entity';
import { PaginationRequestDto } from '@root/pagination/dto/pagination-request.dto';
import { PaginationResponseDto } from '@root/pagination/dto/pagination-response.dto';
import { PageMetaDto } from '@root/pagination/dto/page-meta.dto';
import { getPaginationSkip } from '@root/utils';

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

  async existOrFail(id: number): Promise<void> {
    const existQuery = await this.query(`SELECT EXISTS
      (SELECT * FROM comment WHERE id=${id} AND deleted_at IS NULL)`);
    const isExist = Object.values(existQuery[0])[0];
    if (isExist === '0') {
      throw new NotFoundException(`Can't find Comments with id ${id}`);
    }
  }

  async findAllMyComment(
    userId: number,
    options: PaginationRequestDto,
  ): Promise<PaginationResponseDto<Comment>> {
    const query = this.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.article', 'article')
      .leftJoinAndSelect('article.category', 'category')
      .andWhere('comment.writerId = :id', { id: userId })
      .skip(getPaginationSkip(options))
      .take(options.take)
      .orderBy('comment.createdAt', options.order);

    const totalCount = await query.getCount();
    const entities = await query.getMany();
    const pageMetaDto = new PageMetaDto(options, totalCount);
    return new PaginationResponseDto(entities, pageMetaDto);
  }
}
