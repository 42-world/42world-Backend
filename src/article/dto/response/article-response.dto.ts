import { ApiProperty, PickType } from '@nestjs/swagger';
import { BaseArticleDto } from '@article/dto/base-article.dto';
import { Article } from '@root/article/entities/article.entity';
import { Category } from '@root/category/entities/category.entity';
import { User } from '@root/user/entities/user.entity';

export class ArticleResponseDto extends PickType(BaseArticleDto, [
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
  @ApiProperty({ example: false })
  isLike!: boolean;

  @ApiProperty({ example: false })
  isSelf!: boolean;

  constructor(config: {
    id: number;
    title: string;
    content: string;
    viewCount: number;
    categoryId: number;
    category: Category;
    writerId: number;
    writer: User;
    commentCount: number;
    likeCount: number;
    createdAt: Date;
    updatedAt: Date;
    isLike: boolean;
    isSelf: boolean;
  }) {
    super();

    Object.assign(this, config);
  }

  static of(config: {
    article: Article;
    category: Category;
    writer: User;
    isLike: boolean;
    isSelf: boolean;
  }): ArticleResponseDto {
    return new ArticleResponseDto({
      ...config.article,
      ...config,
    });
  }
}
