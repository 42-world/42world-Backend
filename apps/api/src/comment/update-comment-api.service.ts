import { CommentService } from '@api/comment/comment.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateCommentApiService {
  constructor(private readonly commentService: CommentService) {}

  async updateContent(id: number, writerId: number, content: string): Promise<void> {
    const comment = await this.commentService.findByIdAndWriterIdOrFail(id, writerId);
    comment.updateContent(content);
    await this.commentService.save(comment);
  }
}
