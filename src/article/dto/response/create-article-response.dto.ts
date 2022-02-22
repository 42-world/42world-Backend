import { PickType } from '@nestjs/swagger';
import { BaseArticleDto } from '@article/dto/base-article.dto';
import { Article } from '@root/article/entities/article.entity';

export class CreateArticleResponseDto extends PickType(BaseArticleDto, [
  'id',
  'title',
  'content',
  'viewCount',
  'categoryId',
  'writerId',
  'commentCount',
  'likeCount',
  'createdAt',
  'updatedAt',
]) {
  constructor(
    id: number,
    title: string,
    content: string,
    viewCount: number,
    categoryId: number,
    writerId: number,
    commentCount: number,
    likeCount: number,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();

    this.id = id;
    this.title = title;
    this.content = content;
    this.viewCount = viewCount;
    this.categoryId = categoryId;
    this.writerId = writerId;
    this.commentCount = commentCount;
    this.likeCount = likeCount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static of(article: Article): CreateArticleResponseDto {
    return new CreateArticleResponseDto(
      article.id,
      article.title,
      article.content,
      article.viewCount,
      article.categoryId,
      article.writerId,
      article.commentCount,
      article.likeCount,
      article.createdAt,
      article.updatedAt,
    );
  }
}
