import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { CategoryModule } from './category/category.module';
import { NotificationModule } from './notification/notification.module';
import { AuthenticateModule } from './authenticate/authenticate.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    DatabaseModule,
    CommentModule,
    UserModule,
    ArticleModule,
    CategoryModule,
    NotificationModule,
    AuthenticateModule,
    ConfigModule.register({ folder: './config' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
