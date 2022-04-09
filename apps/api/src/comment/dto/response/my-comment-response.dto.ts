import { ApiProperty, PickType } from '@nestjs/swagger';
import { BaseArticleDto } from '@api/article/dto/base-article.dto';
import { Article } from '@api/article/entities/article.entity';
import { CategoryResponseDto } from '@api/category/dto/response/category-response.dto';
import { Category } from '@api/category/entities/category.entity';
import { BaseCommentDto } from '@api/comment/dto/base-comment.dto';
import { Comment } from '@api/comment/entities/comment.entity';
import { User } from '@api/user/entities/user.entity';

class InnerArticleDto extends PickType(BaseArticleDto, [
  'id',
  'title',
  'category',
]) {
  constructor(config: {
    id: number;
    title: string;
    category: CategoryResponseDto;
  }) {
    super();

    this.id = config.id;
    this.title = config.title;
    this.category = config.category;
  }

  static of(config: {
    article: Article;
    category: Category;
    user: User;
  }): InnerArticleDto {
    return new InnerArticleDto({
      ...config.article,
      category: CategoryResponseDto.of({
        category: config.category,
        user: config.user,
      }),
    });
  }
}

export class MyCommentResponseDto extends PickType(BaseCommentDto, [
  'id',
  'content',
  'createdAt',
  'updatedAt',
]) {
  @ApiProperty({ type: () => InnerArticleDto })
  article: InnerArticleDto;

  constructor(config: {
    id: number;
    content: string;
    article: InnerArticleDto;
    createdAt: Date;
    updatedAt: Date;
  }) {
    super();

    this.id = config.id;
    this.content = config.content;
    this.article = config.article;
    this.createdAt = config.createdAt;
    this.updatedAt = config.updatedAt;
  }

  static of(config: {
    comment: Comment;
    article: Article;
    user: User;
  }): MyCommentResponseDto {
    return new MyCommentResponseDto({
      ...config.comment,
      article: InnerArticleDto.of({
        article: config.article,
        category: config.article.category,
        user: config.user,
      }),
    });
  }

  static ofArray(config: {
    comments: Comment[];
    user: User;
  }): MyCommentResponseDto[] {
    return config.comments.map((comment: Comment) => {
      return MyCommentResponseDto.of({
        comment,
        article: comment.article,
        user: config.user,
      });
    });
  }
}
