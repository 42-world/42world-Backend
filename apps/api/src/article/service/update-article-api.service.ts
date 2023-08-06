import { ArticleService } from '@api/article/article.service';
import { CategoryService } from '@api/category/category.service';
import { User } from '@app/entity/user/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateArticleApiService {
  constructor(
    private readonly articleService: ArticleService, //
    private readonly categoryService: CategoryService,
  ) {}

  /**
   * 게시글 수정
   *
   * @param user 수정하는 유저
   * @param id 게시글 ID
   * @param title 제목
   * @param content 내용
   * @param categoryId 카테고리 ID
   */
  async update(
    user: User,
    id: number,
    title: string | undefined,
    content: string | undefined,
    categoryId: number | undefined,
  ): Promise<void> {
    if (categoryId) {
      await this.categoryService.checkAvailable(user, categoryId, 'writableArticle');
    }

    await this.articleService.update(user, id, title, content, categoryId);
  }
}
