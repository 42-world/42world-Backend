import { ArticleService } from '@api/article/article.service';
import { CategoryService } from '@api/category/category.service';
import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { Article } from '@app/entity/article/article.entity';
import { User } from '@app/entity/user/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchArticleApiService {
  constructor(
    private readonly articleService: ArticleService, //
    private readonly categoryService: CategoryService,
  ) {}

  /**
   * 게시글 검색
   *
   * @param user 검색하는 유저
   * @param q 검색어
   * @param categoryId 카테고리 ID
   * @param options 페이징 옵션
   * @returns
   */
  async search(
    user: User,
    q: string,
    categoryId: number | undefined,
    options: PaginationRequestDto,
  ): Promise<{ articles: Article[]; totalCount: number }> {
    const availableCategories = await this.categoryService.getAvailable(user);

    return await this.articleService.search(q, categoryId, options, availableCategories);
  }
}
