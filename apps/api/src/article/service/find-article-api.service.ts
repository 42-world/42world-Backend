import { ArticleService } from '@api/article/article.service';
import { CategoryService } from '@api/category/category.service';
import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { ReactionService } from '@api/reaction/reaction.service';
import { Article } from '@app/entity/article/article.entity';
import { User } from '@app/entity/user/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindArticleApiService {
  constructor(
    private readonly articleService: ArticleService, //
    private readonly categoryService: CategoryService,
    private readonly reactionService: ReactionService,
  ) {}

  /**
   * 게시글 목록 조회
   *
   * @param user 조회하는 유저
   * @param categoryId 카테고리 ID
   * @param options 페이징 옵션
   * @returns
   */
  async findAllByCategoryId(
    user: User,
    categoryId: number,
    options: PaginationRequestDto,
  ): Promise<{ articles: Article[]; totalCount: number }> {
    await this.categoryService.checkAvailable(user, categoryId, 'readableArticle');

    return await this.articleService.findAllByCategoryId(categoryId, options);
  }

  /**
   * 게시글 조회
   *
   * @param user 조회하는 유저
   * @param articleId 게시글 ID
   * @returns
   */
  async findOneById(user: User, articleId: number): Promise<{ article: Article; isLike: boolean }> {
    const article = await this.articleService.findOneById(user, articleId);
    const isLike = await this.reactionService.isMyReactionArticle(user.id, article.id);

    await this.categoryService.checkAvailable(user, article.categoryId, 'readableArticle');
    await this.articleService.increaseViewCount(user, article);

    return { article, isLike };
  }
}
