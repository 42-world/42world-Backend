import { AppController } from '@api/app.controller';
import { AuthModule } from '@api/auth/auth.module';
import { JwtAuthGuard } from '@api/auth/jwt-auth/jwt-auth.guard';
import { BestModule } from '@api/best/best.module';
import { CategoryModule } from '@api/category/category.module';
import { CommentApiModule } from '@api/comment/comment-api.module';
import { FtCheckinModule } from '@api/ft-checkin/ft-checkin.module';
// import { ConfigModule } from '@app/common/config/config.module';
import { AWS_ACCESS_KEY, AWS_REGION, AWS_SECRET_KEY } from '@api/image/image.constant';
import { ImageModule } from '@api/image/image.module';
import { IntraAuthModule } from '@api/intra-auth/intra-auth.module';
import { NotificationModule } from '@api/notification/notification.module';
import { ReactionModule } from '@api/reaction/reaction.module';
import { UserModule } from '@api/user/user.module';
import { DatabaseModule } from '@app/common/database/database.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AwsSdkModule } from 'nest-aws-sdk';
import { ArticleApiModule } from './article/article-api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    DatabaseModule.register(),
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          region: configService.get(AWS_REGION),
          accessKeyId: configService.get(AWS_ACCESS_KEY),
          secretAccessKey: configService.get(AWS_SECRET_KEY),
        }),
      },
    }),
    CommentApiModule,
    UserModule,
    ArticleApiModule,
    CategoryModule,
    NotificationModule,
    IntraAuthModule,
    AuthModule,
    BestModule,
    ReactionModule,
    FtCheckinModule,
    ImageModule,
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
