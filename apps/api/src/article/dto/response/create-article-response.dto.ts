import { BaseArticleDto } from '@api/article/dto/base-article.dto';
import { CategoryResponseDto } from '@api/category/dto/response/category-response.dto';
import { UserResponseDto } from '@api/user/dto/response/user-response.dto';
import { Article } from '@app/entity/article/article.entity';
import { Category } from '@app/entity/category/category.entity';
import { User } from '@app/entity/user/user.entity';
import { PickType } from '@nestjs/swagger';

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
    category: CategoryResponseDto;
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

  static of(config: { article: Article; category: Category; writer: User; user: User }): CreateArticleResponseDto {
    return new CreateArticleResponseDto({
      ...config.article,
      ...config,
      category: CategoryResponseDto.of({
        category: config.category,
        user: config.user,
      }),
      writer: UserResponseDto.of({ user: config.writer }),
    });
  }
}
