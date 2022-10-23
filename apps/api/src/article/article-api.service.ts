import { ArticleService } from '@api/article/article.service';
import { CategoryService } from '@api/category/category.service';
import { CommentService } from '@api/comment/comment.service';
import { ReactionService } from '@api/reaction/reaction.service';
import { Article } from '@app/entity/article/article.entity';
import { Category } from '@app/entity/category/category.entity';
import { Comment } from '@app/entity/comment/comment.entity';
import { ReactionComment } from '@app/entity/reaction/reaction-comment.entity';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';
import { compareRole } from '@app/utils/utils';
import { Injectable } from '@nestjs/common';
import { PaginationRequestDto } from '../pagination/dto/pagination-request.dto';

@Injectable()
export class ArticleApiService {
  constructor(
    private readonly articleService: ArticleService, //
    private readonly reactionService: ReactionService,
    private readonly commentService: CommentService,
    private readonly categoryService: CategoryService,
  ) {}

  async create(writer: User, title: string, content: string, categoryId: number): Promise<Article> {
    await this.categoryService.checkAvailable(writer, categoryId, 'writableArticle');

    return await this.articleService.create(writer, title, content, categoryId);
  }

  async search(
    user: User,
    q: string,
    categoryId: number | undefined,
    options: PaginationRequestDto,
  ): Promise<{ articles: Article[]; totalCount: number }> {
    const availableCategories = await this.categoryService.getAvailable(user);

    return await this.articleService.search(q, categoryId, options, availableCategories);
  }

  async findAllByCategoryId(
    user: User,
    categoryId: number,
    options: PaginationRequestDto,
  ): Promise<{ articles: Article[]; totalCount: number }> {
    await this.categoryService.checkAvailable(user, categoryId, 'readableArticle');

    return await this.articleService.findAllByCategoryId(categoryId, options);
  }

  async findOneById(user: User, articleId: number): Promise<{ article: Article; isLike: boolean }> {
    const article = await this.articleService.findOneById(user, articleId);
    const isLike = await this.reactionService.isMyReactionArticle(user.id, article.id);

    await this.categoryService.checkAvailable(user, article.categoryId, 'readableArticle');
    await this.articleService.increaseViewCount(user, article);

    return { article, isLike };
  }

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
    const { comments, category, totalCount } = await this.commentService.findAllByArticleId(user, articleId, options);
    let reactionComments = [];
    if (compareRole(category.reactionable as UserRole, user.role as UserRole))
      reactionComments = await this.reactionService.findAllMyReactionComment(user.id, articleId);

    return { comments, category, totalCount, reactionComments };
  }

  async update(
    user: User,
    id: number,
    title: string | undefined,
    content: string | undefined,
    categoryId: number | undefined,
  ): Promise<void> {
    // TODO: categoryId를 확인하는 로직을 지워야함
    if (categoryId) {
      await this.categoryService.checkAvailable(user, categoryId, 'writableArticle');
    }

    await this.articleService.update(user, id, title, content, categoryId);
  }

  async remove(user: User, id: number): Promise<void> {
    await this.articleService.remove(user, id);
  }
}
