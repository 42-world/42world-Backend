import { CategoryService } from '@api/category/category.service';
import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { ReactionService } from '@api/reaction/reaction.service';
import { Article } from '@app/entity/article/article.entity';
import { Category } from '@app/entity/category/category.entity';
import { User } from '@app/entity/user/user.entity';
import {
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleRequestDto } from './dto/request/create-article-request.dto';
import { FindAllArticleRequestDto } from './dto/request/find-all-article-request.dto';
import { UpdateArticleRequestDto } from './dto/request/update-article-request.dto';
import { ArticleRepository } from './repositories/article.repository';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => ReactionService))
    private readonly reactionService: ReactionService,
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

  findAllByWriterId(
    writerId: number,
    options: PaginationRequestDto,
  ): Promise<{
    articles: Article[];
    totalCount: number;
  }> {
    return this.articleRepository.findAllByWriterId(writerId, options);
  }

  findAllBest(options: PaginationRequestDto): Promise<Article[]> {
    return this.articleRepository.findAllBest(options);
  }

  existOrFail(id: number): Promise<void> {
    return this.articleRepository.existOrFail(id);
  }

  findOneByIdOrFail(id: number): Promise<Article | never> {
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
        isLike: boolean;
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
    const isLike = await this.reactionService.isMyReactionArticle(
      user.id,
      article.id,
    );

    return {
      article,
      category: article.category,
      writer: article.writer,
      isLike,
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
    await this.articleRepository.increaseViewCount(articleId);
  }

  async increaseCommentCount(articleId: number): Promise<void> {
    await this.articleRepository.increaseCommentCount(articleId);
  }

  async decreaseCommentCount(articleId: number): Promise<void> {
    await this.articleRepository.decreaseCommentCount(articleId);
  }

  async increaseLikeCount(article: Article): Promise<Article> {
    await this.articleRepository.increaseLikeCount(article.id);
    return { ...article, likeCount: article.likeCount + 1 };
  }

  async decreaseLikeCount(article: Article): Promise<Article | never> {
    if (article.likeCount <= 0) {
      throw new NotAcceptableException('좋아요는 0이하가 될 수 없습니다.');
    }
    await this.articleRepository.decreaseLikeCount(article.id);
    return { ...article, likeCount: article.likeCount - 1 };
  }
}
