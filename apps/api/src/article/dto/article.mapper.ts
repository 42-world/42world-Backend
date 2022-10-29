import { ArticleResponseDto } from '@api/article/dto/response/article-response.dto';
import { CategoryResponseDto } from '@api/category/dto/response/category-response.dto';
import { UserResponseDto } from '@api/user/dto/response/user-response.dto';
import { Article } from '@app/entity/article/article.entity';
import { User } from '@app/entity/user/user.entity';

export class ArticleDtoMapper {
  static toResponseDto({
    article,
    user,
    isLike,
  }: {
    article: Article;
    user: User;
    isLike?: boolean;
  }): ArticleResponseDto {
    const category = CategoryResponseDto.of({ category: article.category, user });
    const writer = UserResponseDto.of({ user: article.writer, isAnonymous: category.isAnonymous });

    return new ArticleResponseDto({
      id: article.id,
      title: article.title,
      content: article.content,
      viewCount: article.viewCount,
      categoryId: article.categoryId,
      category,
      writerId: writer.id,
      writer,
      commentCount: article.commentCount,
      likeCount: article.likeCount,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      isSelf: user.id === article.writer.id,
      isLike,
    });
  }

  static toResponseDtoList({ articles, user }: { articles: Article[]; user: User }): ArticleResponseDto[] {
    return articles.map((article) => this.toResponseDto({ article, user }));
  }
}
