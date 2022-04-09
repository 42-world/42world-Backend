import { PickType } from '@nestjs/swagger';
import { BaseArticleDto } from '@api/article/dto/base-article.dto';
import { Article } from '@api/article/entities/article.entity';
import { User } from '@api/user/entities/user.entity';
import { UserResponseDto } from '@api/user/dto/response/user-response.dto';

export class FindAllArticleResponseDto extends PickType(BaseArticleDto, [
  'id',
  'title',
  'content',
  'viewCount',
  'categoryId',
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
    this.writerId = config.writerId;
    this.writer = config.writer;
    this.commentCount = config.commentCount;
    this.likeCount = config.likeCount;
    this.createdAt = config.createdAt;
    this.updatedAt = config.updatedAt;
  }

  static of(config: {
    articles: Article[];
    user: User;
  }): FindAllArticleResponseDto[] {
    return config.articles.map(
      (article) =>
        new FindAllArticleResponseDto({
          ...article,
          writer: UserResponseDto.of({ user: article.writer }),
        }),
    );
  }
}
