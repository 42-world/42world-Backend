import { CommentRepository } from '@api/comment/repositories/comment.repository';
import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { Comment } from '@app/entity/comment/comment.entity';
import { User } from '@app/entity/user/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';
import { CreateCommentRequestDto } from './dto/request/create-comment-request.dto';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async create(createCommentDto: CreateCommentRequestDto, writerId: number): Promise<Comment> {
    return this.commentRepository.save({
      ...createCommentDto,
      writerId,
    });
  }

  async findAllByArticleId(
    user: User,
    articleId: number,
    options: PaginationRequestDto,
  ): Promise<{
    comments: Comment[];
    totalCount: number;
  }> {
    return await this.commentRepository.findAllByArticleId(articleId, options);
  }

  async findOneByIdOrFail(id: number, options?: FindOneOptions): Promise<Comment> {
    return this.commentRepository.findOneOrFail(id, options);
  }

  async findAllByWriterId(
    writerId: number,
    options: PaginationRequestDto,
  ): Promise<{
    comments: Comment[];
    totalCount: number;
  }> {
    return this.commentRepository.findAllByWriterId(writerId, options);
  }

  async findByIdAndWriterIdOrFail(id: number, writerId: number): Promise<Comment> {
    return this.commentRepository.findOneOrFail({ id, writerId });
  }

  async save(comment: Comment): Promise<Comment> {
    return this.commentRepository.save(comment);
  }

  async softDelete(id: number): Promise<void> {
    await this.commentRepository.softDelete(id);
  }

  async increaseLikeCount(comment: Comment): Promise<Comment> {
    await this.commentRepository.update(comment.id, {
      likeCount: () => 'like_count + 1',
    });
    comment.likeCount += 1;
    return comment;
  }

  async decreaseLikeCount(comment: Comment): Promise<Comment> {
    if (comment.likeCount <= 0) {
      throw new BadRequestException('좋아요는 0이하가 될 수 없습니다.');
    }
    await this.commentRepository.update(comment.id, {
      likeCount: () => 'like_count - 1',
    });
    comment.likeCount -= 1;
    return comment;
  }
}
