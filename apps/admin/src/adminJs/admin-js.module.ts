import { AdminModule, AdminModuleOptions } from '@adminjs/nestjs';
import { Database, Resource } from '@adminjs/typeorm';
import { Article } from '@app/entity/article/article.entity';
import { Best } from '@app/entity/best/best.entity';
import { Category } from '@app/entity/category/category.entity';
import { Comment } from '@app/entity/comment/comment.entity';
import { IntraAuth } from '@app/entity/intra-auth/intra-auth.entity';
import { Notification } from '@app/entity/notification/notification.entity';
import { ReactionArticle } from '@app/entity/reaction/reaction-article.entity';
import { ReactionComment } from '@app/entity/reaction/reaction-comment.entity';
import { User } from '@app/entity/user/user.entity';
import { DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import AdminJS from 'adminjs';

AdminJS.registerAdapter({ Database, Resource });

export class AdminJsModule {
  static register(): DynamicModule {
    return AdminModule.createAdminAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(): AdminModuleOptions {
        return {
          adminJsOptions: {
            rootPath: '/admin',
            resources: [
              IntraAuth,
              Best,
              Notification,
              Category,
              Comment,
              ReactionArticle,
              ReactionComment,
              User,
              Article,
            ],
          },
          auth: {
            authenticate: async () => ({ email: 'test' }),
            cookieName: 'test',
            cookiePassword: 'testPass',
          },
        };
      },
    });
  }
}
