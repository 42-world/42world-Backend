import {
  AdminModule as AdminJsModule,
  AdminModuleOptions,
} from '@adminjs/nestjs';
import { Database, Resource } from '@adminjs/typeorm';
import { Category } from '@app/entity/category/category.entity';
import { IntraAuth } from '@app/entity/intra-auth/intra-auth.entity';
import { Notification } from '@app/entity/notification/notification.entity';
import { User } from '@app/entity/user/user.entity';
import { DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import AdminJS from 'adminjs';

AdminJS.registerAdapter({ Database, Resource });

export class AdminModule {
  static register(): DynamicModule {
    return AdminJsModule.createAdminAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(): AdminModuleOptions {
        return {
          adminJsOptions: {
            rootPath: '/admin',
            resources: [Category, User, IntraAuth, Notification],
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
