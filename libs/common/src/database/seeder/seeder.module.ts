import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from '@app/common/database/database.module';
import { Seeder } from './seeder';
import { UserSeederModule } from './user/user-seeder.module';
import { CategorySeederModule } from './category/category-seeder.module';
import { ArticleSeederModule } from './article/article-seeder.module';
import { ormconfig } from '@app/common/database/ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'config/.env',
      isGlobal: true,
      cache: true,
      load: [ormconfig],
    }),
    DatabaseModule.register(),
    UserSeederModule,
    CategorySeederModule,
    ArticleSeederModule,
  ],
  providers: [Logger, Seeder],
})
export class SeederModule {}
