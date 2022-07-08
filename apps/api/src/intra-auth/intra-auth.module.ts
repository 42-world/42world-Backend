import { UserModule } from '@api/user/user.module';
import { CacheModule } from '@app/common/cache/cache.module';
import { IntraAuth } from '@app/entity/intra-auth/intra-auth.entity';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntraAuthController } from './intra-auth.controller';
import { IntraAuthService } from './intra-auth.service';
import StibeeService from './stibee.service';

@Module({
  imports: [UserModule, CacheModule, TypeOrmModule.forFeature([IntraAuth]), ConfigModule],
  controllers: [IntraAuthController],
  providers: [
    IntraAuthService,
    {
      provide: 'MailService',
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return new StibeeService(config);
      },
    },
    {
      provide: 'UnsubscribeStibeeService',
      useClass: StibeeService,
    },
  ],
  exports: [IntraAuthService],
})
export class IntraAuthModule {}
