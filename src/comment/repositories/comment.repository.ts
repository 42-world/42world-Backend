import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Comment } from '@comment/entities/comment.entity';
import { PageDto } from '@root/pagination/pagination.dto';
import { PageMetaDto } from '@root/pagination/page-meta.dto';
import { PageOptionsDto } from '@root/pagination/page-options.dto';
import { DetailCommentDto } from '@root/article/dto/detail-comment.dto';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  async findAllByArticleId(
    articleId: number,
    options: PageOptionsDto,
  ): Promise<PageDto<DetailCommentDto>> {
    const query = this.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.writer', 'writer')
      .andWhere('comment.articleId = :id', { id: articleId })
      .skip(options.skip)
      .take(options.take)
      .orderBy('comment.createdAt', options.order);

    const totalCount = await query.getCount();
    const entities = await query.getMany();
    const pageMetaDto = new PageMetaDto({
      totalCount,
      pageOptionsDto: options,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async existOrFail(id: number): Promise<void> {
    const exist_query = await this.query(`SELECT EXISTS
      (SELECT * FROM comment WHERE id=${id} AND deleted_at IS NULL)`);
    const is_exist = Object.values(exist_query[0])[0];
    if (is_exist === '0') {
      throw new NotFoundException(`Can't find Comments with id ${id}`);
    }
  }

  async findAllMyComment(
    options: PageOptionsDto,
    userId: number,
  ): Promise<PageDto<Comment>> {
    const query = this.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.article', 'article')
      .leftJoinAndSelect('article.category', 'category')
      .andWhere('comment.writerId = :id', { id: userId })
      .skip(options.skip)
      .take(options.take)
      .orderBy('comment.createdAt', options.order);

    const totalCount = await query.getCount();
    const entities = await query.getMany();
    const pageMetaDto = new PageMetaDto({
      totalCount,
      pageOptionsDto: options,
    });
    return new PageDto(entities, pageMetaDto);
  }
}
