import { IntersectionType, PickType } from '@nestjs/swagger';
import { BaseArticleDto } from '@root/article/dto/base-article.dto';
import { CategoryResponseDto } from '@root/category/dto/response/category-response.dto';
import { Category } from '@root/category/entities/category.entity';
import { BaseCommentDto } from '@root/comment/dto/base-comment.dto';
import { Comment } from '@root/comment/entities/comment.entity';

export class MyCommentResponseDto extends IntersectionType(
  PickType(BaseCommentDto, [
    'id',
    'content',
    'articleId',
    'createdAt',
    'updatedAt',
  ]),
  PickType(BaseArticleDto, ['category']),
) {
  constructor(config: {
    id: number;
    content: string;
    articleId: number;
    category: CategoryResponseDto;
    createdAt: Date;
    updatedAt: Date;
  }) {
    super();

    this.id = config.id;
    this.content = config.content;
    this.articleId = config.articleId;
    this.category = config.category;
    this.createdAt = config.createdAt;
    this.updatedAt = config.updatedAt;
  }

  static of(config: {
    comment: Comment;
    category: Category;
  }): MyCommentResponseDto {
    return new MyCommentResponseDto({
      ...config.comment,
      category: CategoryResponseDto.of({ category: config.category }),
    });
  }

  static ofArray(config: { comments: Comment[] }): MyCommentResponseDto[] {
    return config.comments.map((comment: Comment) => {
      return MyCommentResponseDto.of({
        comment,
        category: comment.article.category,
      });
    });
  }
}
