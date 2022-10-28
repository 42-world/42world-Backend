import { ArticleService } from '@api/article/article.service';
import { CategoryService } from '@api/category/category.service';
import { CommentService } from '@api/comment/services/comment.service';
import { CreateCommentRequestDto } from '@api/comment/dto/request/create-comment-request.dto';
import { NotificationService } from '@api/notification/notification.service';
import { Comment } from '@app/entity/comment/comment.entity';
import { User } from '@app/entity/user/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateCommentApiService {
  constructor(
    private readonly commentService: CommentService,
    private readonly categoryService: CategoryService,
    private readonly articleService: ArticleService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(writer: User, createCommentDto: CreateCommentRequestDto): Promise<Comment> {
    const article = await this.articleService.findOneByIdOrFail(createCommentDto.articleId);
    await this.categoryService.checkAvailable(writer, article.categoryId, 'writableComment');

    const comment = Comment.createComment(createCommentDto.content, createCommentDto.articleId, writer.id);
    await this.commentService.save(comment);

    if (writer.id !== article.writerId) {
      await this.notificationService.createNewComment(article, comment);
    }
    await this.articleService.increaseCommentCount(article.id);
    return comment;
  }
}
