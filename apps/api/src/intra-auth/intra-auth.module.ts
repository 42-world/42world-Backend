import { UserModule } from '@api/user/user.module';
import { Module } from '@nestjs/common';
import { IntraAuthService } from './intra-auth.service';
import { IntraAuthController } from './intra-auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntraAuth } from '@api/intra-auth/entities/intra-auth.entity';
import { CacheModule } from '@app/common/cache/cache.module';

@Module({
  imports: [UserModule, CacheModule, TypeOrmModule.forFeature([IntraAuth])],
  controllers: [IntraAuthController],
  providers: [IntraAuthService],
})
export class IntraAuthModule {}
