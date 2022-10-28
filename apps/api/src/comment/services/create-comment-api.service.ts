import { ArticleService } from '@api/article/article.service';
import { CategoryService } from '@api/category/category.service';
import { CommentService } from '@api/comment/services/comment.service';
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

  async create(props: { writer: User; content: string; articleId: number }): Promise<Comment> {
    const article = await this.articleService.findOneByIdOrFail(props.articleId);
    await this.categoryService.checkAvailable(props.writer, article.categoryId, 'writableComment');

    const comment = Comment.createComment({
      content: props.content,
      articleId: props.articleId,
      writerId: props.writer.id,
    });
    await this.commentService.save(comment);

    if (props.writer.id !== article.writerId) {
      await this.notificationService.createNewComment(article, comment);
    }
    await this.articleService.increaseCommentCount(article.id);
    return comment;
  }
}
