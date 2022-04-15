import { ArticleService } from '@api/article/article.service';
import { CommentRepository } from '@api/comment/repositories/comment.repository';
import { NotificationService } from '@api/notification/notification.service';
import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { Comment } from '@app/entity/comment/comment.entity';
import {
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { FindOneOptions } from 'typeorm';
import { CreateCommentRequestDto } from './dto/request/create-comment-request.dto';
import { UpdateCommentRequestDto } from './dto/request/update-comment-request.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    @Inject(forwardRef(() => ArticleService))
    private readonly articleService: ArticleService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(
    writerId: number,
    createCommentDto: CreateCommentRequestDto,
  ): Promise<Comment | never> {
    const article = await this.articleService.findOneByIdOrFail(
      createCommentDto.articleId,
    );
    const comment = await this.commentRepository.save({
      ...createCommentDto,
      writerId,
    });
    this.notificationService.createNewComment(article, comment);
    this.articleService.increaseCommentCount(article.id);
    return comment;
  }

  async findAllByArticleId(
    articleId: number,
    options: PaginationRequestDto,
  ): Promise<
    | {
        comments: Comment[];
        totalCount: number;
      }
    | never
  > {
    await this.articleService.existOrFail(articleId);
    return this.commentRepository.findAllByArticleId(articleId, options);
  }

  findOneByIdOrFail(id: number, options?: FindOneOptions): Promise<Comment> {
    return this.commentRepository.findOneOrFail(id, options);
  }

  findAllByWriterId(
    writerId: number,
    options: PaginationRequestDto,
  ): Promise<{
    comments: Comment[];
    totalCount: number;
  }> {
    return this.commentRepository.findAllByWriterId(writerId, options);
  }

  async updateContent(
    id: number,
    writerId: number,
    updateCommentDto: UpdateCommentRequestDto,
  ): Promise<void | never> {
    const comment = await this.commentRepository.findOneOrFail({
      id,
      writerId,
    });
    const newComment = {
      ...comment,
      ...updateCommentDto,
    };
    await this.commentRepository.save(newComment);
  }

  async remove(id: number, writerId: number): Promise<void> {
    const result = await this.commentRepository.softDelete({
      id,
      writerId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Comment with id ${id}`);
    }

    const comment = await this.findOneByIdOrFail(id, { withDeleted: true });
    this.articleService.decreaseCommentCount(comment.articleId);
  }

  increaseLikeCount(comment: Comment): Promise<Comment> {
    comment.likeCount += 1;
    return this.commentRepository.save(comment);
  }

  decreaseLikeCount(comment: Comment): Promise<Comment> {
    if (comment.likeCount <= 0) {
      throw new NotAcceptableException('좋아요는 0이하가 될 수 없습니다.');
    }
    comment.likeCount -= 1;
    return this.commentRepository.save(comment);
  }
}