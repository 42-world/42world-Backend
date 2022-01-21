import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { CategoryModule } from './category/category.module';
import { NotificationModule } from './notification/notification.module';
import { AuthenticateModule } from './authenticate/authenticate.module';
import { AuthModule } from './auth/auth.module';
import { BestModule } from './best/best.module';
import { ReactionModule } from './reaction/reaction.module';
import { DatabaseModule } from './database/database.module';
import { getEnvPath } from './utils';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ormconfig } from './database/ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvPath(),
      isGlobal: true,
      cache: true,
      load: [ormconfig],
    }),
    DatabaseModule.register(),
    CommentModule,
    UserModule,
    ArticleModule,
    CategoryModule,
    NotificationModule,
    AuthenticateModule,
    AuthModule,
    BestModule,
    ReactionModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
