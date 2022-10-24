import { ArticleService } from '@api/article/article.service';
import { CommentService } from '@api/comment/comment.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RemoveCommentApiService {
  constructor(private readonly commentService: CommentService, private readonly articleService: ArticleService) {}

  async remove(id: number, writerId: number): Promise<void> {
    const comment = await this.commentService.findByIdAndWriterIdOrFail(id, writerId);

    await this.commentService.softDelete(id);
    await this.articleService.decreaseCommentCount(comment.articleId);
  }
}
