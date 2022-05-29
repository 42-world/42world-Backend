import { CategoryService } from '@api/category/category.service';
import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { Article } from '@app/entity/article/article.entity';
import { Category } from '@app/entity/category/category.entity';
import { User } from '@app/entity/user/user.entity';
import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleRequestDto } from './dto/request/create-article-request.dto';
import { FindAllArticleRequestDto } from './dto/request/find-all-article-request.dto';
import { SearchArticleRequestDto } from './dto/request/search-article-request.dto';
import { UpdateArticleRequestDto } from './dto/request/update-article-request.dto';
import { ArticleRepository } from './repositories/article.repository';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly categoryService: CategoryService,
  ) {}

  async create(
    writer: User,
    createArticleDto: CreateArticleRequestDto,
  ): Promise<
    | {
        article: Article; //
        category: Category;
      }
    | never
  > {
    const category = await this.categoryService.findOneOrFail(
      createArticleDto.categoryId,
    );
    this.categoryService.checkAvailable('writableArticle', category, writer);
    const article = await this.articleRepository.save({
      ...createArticleDto,
      writerId: writer.id,
    });

    return { article, category };
  }

  async findAll(
    user: User,
    options: FindAllArticleRequestDto,
  ): Promise<{
    articles: Article[];
    category: Category;
    totalCount: number;
  }> {
    const category = await this.categoryService.findOneOrFail(
      options.categoryId,
    );
    this.categoryService.checkAvailable('readableArticle', category, user);
    const { articles, totalCount } = await this.articleRepository.findAll(
      options,
    );
    return {
      articles,
      category,
      totalCount,
    };
  }

  async search(
    user: User,
    options: SearchArticleRequestDto,
  ): Promise<{
    articles: Article[];
    totalCount: number;
  }> {
    const availableCategories = await this.categoryService.getAvailable(user);
    const { articles, totalCount } = await this.articleRepository.search(
      options,
      availableCategories,
    );
    return { articles, totalCount };
  }

  async searchByCategory(
    user: User,
    options: SearchArticleRequestDto,
    categoryId: number,
  ): Promise<{
    articles: Article[];
    totalCount: number;
  }> {
    const availableCategories = await this.categoryService.getAvailable(user);
    if (!availableCategories.some((category) => category.id === categoryId)) {
      throw new NotAcceptableException(
        `Category ${categoryId} is not available`,
      );
    }
    const { articles, totalCount } =
      await this.articleRepository.searchByCategory(categoryId, options);
    return { articles, totalCount };
  }

  async findAllByWriterId(
    writerId: number,
    options: PaginationRequestDto,
  ): Promise<{
    articles: Article[];
    totalCount: number;
  }> {
    return this.articleRepository.findAllByWriterId(writerId, options);
  }

  async findAllBest(options: PaginationRequestDto): Promise<Article[]> {
    return this.articleRepository.findAllBest(options);
  }

  async existOrFail(id: number): Promise<void> {
    return this.articleRepository.existOrFail(id);
  }

  async findOneByIdOrFail(id: number): Promise<Article | never> {
    return this.articleRepository.findOneOrFail(id);
  }

  async findOneOrFail(
    id: number,
    user: User,
  ): Promise<
    | {
        article: Article;
        category: Category;
        writer: User;
      }
    | never
  > {
    const article = await this.articleRepository.findOneOrFail(id, {
      relations: ['writer', 'category'],
    });
    this.categoryService.checkAvailable(
      'readableArticle',
      article.category,
      user,
    );

    return {
      article,
      category: article.category,
      writer: article.writer,
    };
  }

  async update(
    id: number,
    writerId: number,
    updateArticleRequestDto: UpdateArticleRequestDto,
  ): Promise<void | never> {
    if (updateArticleRequestDto.categoryId)
      await this.categoryService.existOrFail(
        updateArticleRequestDto.categoryId,
      );
    const article = await this.articleRepository.findOneOrFail({
      id,
      writerId,
    });
    const newArticle = {
      ...article,
      ...updateArticleRequestDto,
    };

    await this.articleRepository.save(newArticle);
  }

  async remove(id: number, writerId: number): Promise<void | never> {
    const result = await this.articleRepository.softDelete({
      id,
      writerId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Can't find Article with id ${id} with writer ${writerId}`,
      );
    }
  }

  async increaseViewCount(articleId: number): Promise<void> {
    await this.articleRepository.update(articleId, {
      viewCount: () => 'view_count + 1',
    });
  }

  async increaseCommentCount(articleId: number): Promise<void> {
    await this.articleRepository.update(articleId, {
      commentCount: () => 'comment_count + 1',
    });
  }

  async decreaseCommentCount(articleId: number): Promise<void> {
    await this.articleRepository.update(articleId, {
      commentCount: () => 'comment_count - 1',
    });
  }

  async increaseLikeCount(article: Article): Promise<Article> {
    await this.articleRepository.update(article.id, {
      likeCount: () => 'like_count + 1',
    });
    article.likeCount += 1;
    return article;
  }

  async decreaseLikeCount(article: Article): Promise<Article | never> {
    if (article.likeCount <= 0) {
      throw new NotAcceptableException('좋아요는 0이하가 될 수 없습니다.');
    }
    await this.articleRepository.update(article.id, {
      likeCount: () => 'like_count - 1',
    });
    article.likeCount -= 1;
    return article;
  }
}
