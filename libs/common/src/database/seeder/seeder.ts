import { Injectable } from '@nestjs/common';
import { ArticleSeederService } from './article/article-seeder.service';
import { CategorySeederService } from './category/category-seeder.service';
import { UserSeederService } from './user/user-seeder.service';

@Injectable()
export class Seeder {
  constructor(
    private readonly userSeederService: UserSeederService,
    private readonly categorySeederService: CategorySeederService,
    private readonly articleSeederService: ArticleSeederService,
  ) {}

  async seed() {
    await Promise.all([
      this.userSeederService.create(),
      this.categorySeederService.create(),
      this.articleSeederService.create(),
    ]);
  }
}
