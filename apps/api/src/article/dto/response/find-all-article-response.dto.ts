import { BaseArticleDto } from '@api/article/dto/base-article.dto';
import { AnonyUserResponseDto } from '@api/user/dto/response/anony-user-response.dto';
import { UserResponseDto } from '@api/user/dto/response/user-response.dto';
import { ANONY_USER_ID } from '@api/user/user.constant';
import { Article } from '@app/entity/article/article.entity';
import { Category } from '@app/entity/category/category.entity';
import { User } from '@app/entity/user/user.entity';
import { PickType } from '@nestjs/swagger';

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
    this.writerId = config.writerId;
    this.writer = config.writer;
    this.commentCount = config.commentCount;
    this.likeCount = config.likeCount;
    this.createdAt = config.createdAt;
    this.updatedAt = config.updatedAt;
  }

  static of(config: {
    articles: Article[];
    category: Category;
    user: User;
  }): FindAllArticleResponseDto[] {
    return config.articles.map((article) => {
      const writer = config.category.anonymity
        ? AnonyUserResponseDto.of()
        : UserResponseDto.of({ user: article.writer });
      const writerId = config.category.anonymity
        ? ANONY_USER_ID
        : article.writerId;

      return new FindAllArticleResponseDto({
        ...article,
        writer,
        writerId,
      });
    });
  }
}
