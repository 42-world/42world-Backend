import { ArticleService } from '@api/article/article.service';
import { CategoryService } from '@api/category/category.service';
import { CommentRepository } from '@api/comment/repositories/comment.repository';
import { NotificationService } from '@api/notification/notification.service';
import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { Category } from '@app/entity/category/category.entity';
import { Comment } from '@app/entity/comment/comment.entity';
import { User } from '@app/entity/user/user.entity';
import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
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
    private readonly categoryService: CategoryService,
  ) {}

  async create(writer: User, createCommentDto: CreateCommentRequestDto): Promise<Comment | never> {
    const article = await this.articleService.findOneByIdOrFail(createCommentDto.articleId);
    const category = await this.categoryService.findOneOrFail(article.categoryId);
    this.categoryService.checkAvailable('writableComment', category, writer);
    const comment = await this.commentRepository.save({
      ...createCommentDto,
      writerId: writer.id,
    });

    if (writer.id !== article.writerId) {
      await this.notificationService.createNewComment(article, comment);
    }
    await this.articleService.increaseCommentCount(article.id);
    return comment;
  }

  async findAllByArticleId(
    user: User,
    articleId: number,
    options: PaginationRequestDto,
  ): Promise<
    | {
        comments: Comment[];
        category: Category;
        totalCount: number;
      }
    | never
  > {
    const article = await this.articleService.findOneByIdOrFail(articleId);
    const category = await this.categoryService.findOneOrFail(article.categoryId);
    this.categoryService.checkAvailable('readableComment', category, user);
    const { comments, totalCount } = await this.commentRepository.findAllByArticleId(articleId, options);
    return { comments, category, totalCount };
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

  async updateContent(id: number, writerId: number, updateCommentDto: UpdateCommentRequestDto): Promise<void | never> {
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
    await this.articleService.decreaseCommentCount(comment.articleId);
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
