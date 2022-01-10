import { Injectable } from '@nestjs/common';

import { ArticleRepository } from './repositories/article.repository';
import { FindAllArticleDto } from './dto/find-all-article.dto';

@Injectable()
export class ArticleService {
  constructor(private readonly articleRepository: ArticleRepository) {}

  findAll(options?: FindAllArticleDto) {
    return this.articleRepository.findAll(options);
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }
}
