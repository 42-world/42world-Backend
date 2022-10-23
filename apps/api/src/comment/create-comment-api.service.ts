import { CategoryService } from '@api/category/category.service';
import { CommentService } from '@api/comment/comment.service';
import { CreateCommentRequestDto } from '@api/comment/dto/request/create-comment-request.dto';
import { Comment } from '@app/entity/comment/comment.entity';
import { User } from '@app/entity/user/user.entity';
import { Injectable } from '@nestjs/common';
import {ArticleService} from "@api/article/article.service";

@Injectable()
export class CreateCommentApiService {
  constructor(private readonly commentService: CommentService,
              private readonly categoryService: CategoryService,
              private readonly articleService: ArticleService) {}

  async create(writer: User, createCommentDto: CreateCommentRequestDto): Promise<Comment | never> {
    const article = await this.articleService.findOneByIdOrFail(createCommentDto.articleId);
    await this.categoryService.checkAvailable(writer, article.categoryId, 'writableComment');
    const comment = await this.commentService.create(createCommentDto, writer.id);

    if (writer.id !== article.writerId) {
      await this.notificationService.createNewComment(article, comment);
    }
    await this.articleService.increaseCommentCount(article.id);
    return comment;
  }
}
