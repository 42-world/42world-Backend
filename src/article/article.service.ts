import {
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ArticleRepository } from './repositories/article.repository';
import { FindArticleRequestDto } from './dto/request/find-article-request.dto';
import { CreateArticleRequestDto } from './dto/request/create-article-request.dto';
import { UpdateArticleRequestDto } from './dto/request/update-article-request.dto';
import { Article } from './entities/article.entity';
import { CategoryService } from '@root/category/category.service';
import { FindAllBestDto } from '@root/best/dto/find-all-best.dto';
import { ReactionService } from '@root/reaction/reaction.service';
import { Category } from '@root/category/entities/category.entity';
import { User } from '@root/user/entities/user.entity';

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

  findAll(options: FindArticleRequestDto): Promise<{
    articles: Article[];
    totalCount: number;
  }> {
    return this.articleRepository.findAll(options);
  }

  findAllBest(options: FindAllBestDto): Promise<Article[]> {
    return this.articleRepository.findAllBest(options);
  }

  existOrFail(id: number): Promise<void> {
    return this.articleRepository.existOrFail(id);
  }

  findOneOrFailById(id: number): Promise<Article | never> {
    return this.articleRepository.findOneOrFail(id);
  }

  async findOneOrFail(
    id: number,
    userId: number,
  ): Promise<
    | {
        article: Article;
        category: Category;
        writer: User;
        isLike: boolean;
        isSelf: boolean;
      }
    | never
  > {
    const article = await this.articleRepository.findOneOrFail(id, {
      relations: ['writer', 'category'],
    });
    const category: Category = article.category;
    const writer: User = article.writer;
    const isLike = await this.reactionService.isMyReactionArticle(
      userId,
      article.id,
    );
    const isSelf = userId === article.writerId;

    return { article, category, writer, isLike, isSelf };
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

  findAllMyArticle(userId: number): Promise<Article[]> {
    return this.articleRepository.findAllMyArticle(userId);
  }
}
