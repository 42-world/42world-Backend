import { DatabaseModule } from '@app/common/database/database.module';
import { ormconfig } from '@app/common/database/ormconfig';
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
      envFilePath: 'infra/config/.env',
      isGlobal: true,
      cache: true,
      load: [ormconfig],
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
