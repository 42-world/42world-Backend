import { UserModule } from '@api/user/user.module';
import { CacheModule } from '@app/common/cache/cache.module';
import { IntraAuth } from '@app/entity/intra-auth/intra-auth.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntraAuthController } from './intra-auth.controller';
import { IntraAuthService } from './intra-auth.service';

@Module({
  imports: [UserModule, CacheModule, TypeOrmModule.forFeature([IntraAuth])],
  controllers: [IntraAuthController],
  providers: [IntraAuthService],
})
export class IntraAuthModule {}
