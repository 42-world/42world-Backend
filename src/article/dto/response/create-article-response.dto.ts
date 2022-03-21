import { PickType } from '@nestjs/swagger';
import { BaseArticleDto } from '@article/dto/base-article.dto';
import { Article } from '@root/article/entities/article.entity';
import { Category } from '@root/category/entities/category.entity';
import { User } from '@root/user/entities/user.entity';
import { UserResponseDto } from '@root/user/dto/response/user-response.dto';
import { CategoryUserAuthResponseDto } from '@root/category/dto/response/category-user-auth-response.dto';

export class CreateArticleResponseDto extends PickType(BaseArticleDto, [
  'id',
  'title',
  'content',
  'viewCount',
  'categoryId',
  'category',
  'writerId',
  'writer',
  'commentCount',
  'likeCount',
  'createdAt',
  'updatedAt',
]) {
  constructor(config: {
    id: number;
    title: string;
    content: string;
    viewCount: number;
    categoryId: number;
    category: CategoryUserAuthResponseDto;
    writerId: number;
    writer: UserResponseDto;
    commentCount: number;
    likeCount: number;
    createdAt: Date;
    updatedAt: Date;
  }) {
    super();

    this.id = config.id;
    this.title = config.title;
    this.content = config.content;
    this.viewCount = config.viewCount;
    this.categoryId = config.categoryId;
    this.category = config.category;
    this.writerId = config.writerId;
    this.writer = config.writer;
    this.commentCount = config.commentCount;
    this.likeCount = config.likeCount;
    this.createdAt = config.createdAt;
    this.updatedAt = config.updatedAt;
  }

  static of(config: {
    article: Article;
    category: Category;
    writer: User;
    user: User;
  }): CreateArticleResponseDto {
    return new CreateArticleResponseDto({
      ...config.article,
      ...config,
      category: CategoryUserAuthResponseDto.of({
        category: config.category,
        user: config.user,
      }),
      writer: UserResponseDto.of({ user: config.writer }),
    });
  }
}
