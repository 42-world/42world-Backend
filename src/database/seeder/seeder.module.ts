import { Module, Logger } from '@nestjs/common';

import { DatabaseModule } from '@database/database.module';
import { Seeder } from './seeder';
import { UserSeederModule } from './user/user-seeder.module';
import { CategorySeederModule } from './category/category-seeder.module';
import { ArticleSeederModule } from './article/article-seeder.module';

@Module({
  imports: [
    DatabaseModule,
    UserSeederModule,
    CategorySeederModule,
    ArticleSeederModule,
  ],
  providers: [Logger, Seeder],
})
export class SeederModule {}
