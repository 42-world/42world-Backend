import { DatabaseModule } from '@app/common/database/database.module';
import { IntraAuthSeederModule } from '@app/common/database/seeder/intra-auth/intra-auth-seeder.module';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArticleSeederModule } from './article/article-seeder.module';
import { CategorySeederModule } from './category/category-seeder.module';
import { Seeder } from './seeder';
import { UserSeederModule } from './user/user-seeder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    DatabaseModule.register(),
    UserSeederModule,
    CategorySeederModule,
    ArticleSeederModule,
    IntraAuthSeederModule,
  ],
  providers: [Logger, Seeder],
})
export class SeederModule {}
