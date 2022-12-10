import { ArticleService } from '@api/article/article.service';
import { CategoryService } from '@api/category/category.service';
import { Article } from '@app/entity/article/article.entity';
import { User } from '@app/entity/user/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateArticleApiService {
  constructor(
    private readonly articleService: ArticleService, //
    private readonly categoryService: CategoryService,
  ) {}

  /**
   * 게시글 업로드
   *
   * @param writer 작성자
   * @param title 제목
   * @param content 내용
   * @param categoryId 카테고리 ID
   * @returns
   */
  async create(writer: User, title: string, content: string, categoryId: number): Promise<Article> {
    await this.categoryService.checkAvailable(writer, categoryId, 'writableArticle');

    return await this.articleService.create(writer, title, content, categoryId);
  }
}
