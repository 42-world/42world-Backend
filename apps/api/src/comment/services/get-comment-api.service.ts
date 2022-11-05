import { ArticleService } from '@api/article/article.service';
import { CategoryService } from '@api/category/category.service';
import { CommentService } from '@api/comment/services/comment.service';
import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { ReactionService } from '@api/reaction/reaction.service';
import { Category } from '@app/entity/category/category.entity';
import { Comment } from '@app/entity/comment/comment.entity';
import { ReactionComment } from '@app/entity/reaction/reaction-comment.entity';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';
import { compareRole } from '@app/utils/utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetCommentApiService {
  constructor(
    private readonly articleService: ArticleService,
    private readonly categoryService: CategoryService,
    private readonly reactionService: ReactionService,
    private readonly commentService: CommentService,
  ) {}

  async getComments(
    user: User,
    articleId: number,
    options: PaginationRequestDto,
  ): Promise<{
    comments: Comment[];
    reactionComments: ReactionComment[];
    category: Category;
    totalCount: number;
  }> {
    const article = await this.articleService.findOneByIdOrFail(articleId);
    const category = await this.categoryService.findOneOrFail(article.categoryId);
    this.categoryService.checkAvailableSync(user, category, 'readableComment');

    const { comments, totalCount } = await this.commentService.findAllByArticleId(user, articleId, options);

    let reactionComments = [];
    if (compareRole(category.reactionable as UserRole, user.role as UserRole))
      reactionComments = await this.reactionService.findAllMyReactionComment(user.id, articleId);

    return { comments, category, totalCount, reactionComments };
  }
}
