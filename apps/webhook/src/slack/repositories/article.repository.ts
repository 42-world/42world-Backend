import { Article } from '@app/entity/article/article.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Article)
export class ArticleRepository extends Repository<Article> {}
