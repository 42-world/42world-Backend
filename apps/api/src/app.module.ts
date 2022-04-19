import { AppController } from '@api/app.controller';
import { ArticleModule } from '@api/article/article.module';
import { AuthModule } from '@api/auth/auth.module';
import { JwtAuthGuard } from '@api/auth/jwt-auth.guard';
import { BestModule } from '@api/best/best.module';
import { CategoryModule } from '@api/category/category.module';
import { CommentModule } from '@api/comment/comment.module';
import { FtCheckinModule } from '@api/ft-checkin/ft-checkin.module';
import {
  AWS_ACCESS_KEY,
  AWS_REGION,
  AWS_SECRET_KEY,
} from '@api/image/image.constant';
import { ImageModule } from '@api/image/image.module';
import configEmail from '@api/intra-auth/intra-auth.config';
import { IntraAuthModule } from '@api/intra-auth/intra-auth.module';
import { NotificationModule } from '@api/notification/notification.module';
import { ReactionModule } from '@api/reaction/reaction.module';
import { UserModule } from '@api/user/user.module';
import { DatabaseModule } from '@app/common/database/database.module';
import { ormconfig } from '@app/common/database/ormconfig';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { CacheModule, HttpException, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AwsSdkModule } from 'nest-aws-sdk';
import { RavenInterceptor, RavenModule } from 'nest-raven';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'config/.env',
      isGlobal: true,
      cache: true,
      load: [ormconfig, configEmail],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          ...config.get('email'),
          template: {
            dir: path.join(__dirname, '../views/intra-auth/'),
            adapter: new EjsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
    DatabaseModule.register(),
    CacheModule.register({
      isGlobal: true,
    }),
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          return {
            region: configService.get(AWS_REGION),
            accessKeyId: configService.get(AWS_ACCESS_KEY),
            secretAccessKey: configService.get(AWS_SECRET_KEY),
          };
        },
      },
    }),
    CommentModule,
    UserModule,
    ArticleModule,
    CategoryModule,
    NotificationModule,
    IntraAuthModule,
    AuthModule,
    BestModule,
    ReactionModule,
    FtCheckinModule,
    ImageModule,
    RavenModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
      useValue: new RavenInterceptor({
        filters: [
          // Filter exceptions of type HttpException. Ignore those that
          // have status code of less than 500
          {
            type: HttpException,
            filter: (exception: HttpException) => 500 > exception.getStatus(),
          },
        ],
      }),
    },
  ],
})
export class AppModule {}
