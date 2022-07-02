import { BaseArticleDto } from '@api/article/dto/base-article.dto';
import { CategoryResponseDto } from '@api/category/dto/response/category-response.dto';
import { AnonyUserResponseDto } from '@api/user/dto/response/anony-user-response.dto';
import { UserResponseDto } from '@api/user/dto/response/user-response.dto';
import { ANONY_USER_ID } from '@api/user/user.constant';
import { Article } from '@app/entity/article/article.entity';
import { Category } from '@app/entity/category/category.entity';
import { User } from '@app/entity/user/user.entity';
import { PickType } from '@nestjs/swagger';

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
  constructor(config: {
    id: number;
    title: string;
    content: string;
    viewCount: number;
    categoryId: number;
    category: CategoryResponseDto;
    writerId: number;
    writer: UserResponseDto | AnonyUserResponseDto;
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

  static of(config: { article: Article; category: Category; writer: User; user: User }): ArticleResponseDto {
    const category = CategoryResponseDto.of({
      category: config.category,
      user: config.user,
    });
    const writer = category.isAnonymous ? AnonyUserResponseDto.of() : UserResponseDto.of({ user: config.writer });
    const writerId = category.isAnonymous ? ANONY_USER_ID : config.article.writerId;

    return new ArticleResponseDto({
      ...config.article,
      ...config,
      category,
      writer,
      writerId,
    });
  }

  static ofArray(config: { articles: Article[]; user: User }): ArticleResponseDto[] {
    return config.articles.map((article) =>
      ArticleResponseDto.of({
        article,
        category: article.category,
        writer: article.writer,
        user: config.user,
      }),
    );
  }
}
