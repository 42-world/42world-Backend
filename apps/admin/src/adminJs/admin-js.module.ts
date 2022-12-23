import { Article } from '@admin/entity/article/article.entity';
import { Best } from '@admin/entity/best/best.entity';
import { Category } from '@admin/entity/category/category.entity';
import { Comment } from '@admin/entity/comment/comment.entity';
import { IntraAuth } from '@admin/entity/intra-auth/intra-auth.entity';
import { Notification } from '@admin/entity/notification/notification.entity';
import { ReactionArticle } from '@admin/entity/reaction/reaction-article.entity';
import { ReactionComment } from '@admin/entity/reaction/reaction-comment.entity';
import { User } from '@admin/entity/user/user.entity';
import { AdminModule, AdminModuleOptions } from '@adminjs/nestjs';
import { Database, Resource } from '@adminjs/typeorm';
import { DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import AdminJS from 'adminjs';

AdminJS.registerAdapter({ Database, Resource });

export class AdminJsModule {
  static register(): DynamicModule {
    return AdminModule.createAdminAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService): AdminModuleOptions {
        return {
          adminJsOptions: {
            rootPath: configService.get('ADMIN_URL'),
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
            authenticate: async (email, password) => {
              if (email === configService.get('ADMIN_EMAIL') && password === configService.get('ADMIN_PASSWORD')) {
                return { email };
              }
              return null;
            },
            cookieName: configService.get('ADMIN_COOKIE_NAME'),
            cookiePassword: configService.get('ADMIN_COOKIE_PASSWORD'),
          },
        };
      },
    });
  }
}
