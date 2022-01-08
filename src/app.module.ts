import { join } from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { CategoryModule } from './category/category.module';
import { NotificationModule } from './notification/notification.module';
import { AuthenticateModule } from './authenticate/authenticate.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 2345,
      username: 'ft_world',
      password: 'ft_world',
      database: 'ft_world',
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true,
    }),
    CommentModule,
    UserModule,
    ArticleModule,
    CategoryModule,
    NotificationModule,
    AuthenticateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
