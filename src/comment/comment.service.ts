import {
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ArticleService } from '@root/article/article.service';
import { NotificationService } from '@root/notification/notification.service';
import { FindOneOptions } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { CommentRepository } from '@comment/repositories/comment.repository';
import { PaginationRequestDto } from '@root/pagination/dto/pagination-request.dto';

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
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const article = await this.articleService.findOneOrFailById(
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
    paginationRequestDto: PaginationRequestDto,
  ): Promise<
    | {
        comments: Comment[];
        totalCount: number;
      }
    | never
  > {
    await this.articleService.existOrFail(articleId);
    return this.commentRepository.findAllByArticleId(
      articleId,
      paginationRequestDto,
    );
  }

  getOne(id: number, options?: FindOneOptions): Promise<Comment> {
    return this.commentRepository.findOneOrFail(id, options);
  }

  async updateContent(
    id: number,
    writerId: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOneOrFail({
      id,
      writerId,
    });

    comment.content = updateCommentDto.content;
    return this.commentRepository.save(comment);
  }

  async remove(id: number, writerId: number): Promise<void> {
    const result = await this.commentRepository.softDelete({
      id,
      writerId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Comment with id ${id}`);
    }

    const comment = await this.getOne(id, { withDeleted: true });
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

  async findAllMyComment(
    userId: number,
    options?: PageOptionsDto,
  ): Promise<PageDto<Comment>> {
    return this.commentRepository.findAllMyComment(userId, options);
  }
}
