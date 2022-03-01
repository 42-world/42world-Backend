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

  constructor(
    public id: number,
    public title: string,
    public content: string,
    public viewCount: number,
    public categoryId: number,
    public category: Category,
    public writerId: number,
    public writer: User,
    public commentCount: number,
    public likeCount: number,
    public createdAt: Date,
    public updatedAt: Date,
    isLike: boolean,
    isSelf: boolean,
  ) {
    super();

    this.isLike = isLike;
    this.isSelf = isSelf;
  }

  static of(
    article: Article,
    category: Category,
    writer: User,
    isLike: boolean,
    isSelf: boolean,
  ): ArticleResponseDto {
    return new ArticleResponseDto(
      article.id,
      article.title,
      article.content,
      article.viewCount,
      article.categoryId,
      category,
      article.writerId,
      writer,
      article.commentCount,
      article.likeCount,
      article.createdAt,
      article.updatedAt,
      isLike,
      isSelf,
    );
  }
}
