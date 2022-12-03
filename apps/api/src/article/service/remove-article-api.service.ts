import { ArticleService } from '@api/article/article.service';
import { User } from '@app/entity/user/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RemoveArticleApiService {
  constructor(
    private readonly articleService: ArticleService, //
  ) {}

  /**
   * 게시글 삭제
   *
   * @param user 삭제하는 유저
   * @param id 게시글 ID
   */
  async remove(user: User, id: number): Promise<void> {
    await this.articleService.remove(user, id);
  }
}
