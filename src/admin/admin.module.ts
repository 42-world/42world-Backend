import { DynamicModule } from '@nestjs/common';
import {
  AdminModule as AdminJsModule,
  AdminModuleOptions,
} from '@adminjs/nestjs';
import { Category } from '@category/entities/category.entity';
import AdminJS from 'adminjs';
import { Database, Resource } from '@adminjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '@user/entities/user.entity';
import { IntraAuth } from '@intra-auth/entities/intra-auth.entity';

AdminJS.registerAdapter({ Database, Resource });

export class AdminModule {
  static register(): DynamicModule {
    return AdminJsModule.createAdminAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService): AdminModuleOptions {
        return {
          adminJsOptions: {
            rootPath: '/admin',
            resources: [Category, User, IntraAuth],
          },
          auth: {
            authenticate: async (email, password) => ({ email: 'test' }),
            cookieName: 'test',
            cookiePassword: 'testPass',
          },
        };
      },
    });
  }
}
