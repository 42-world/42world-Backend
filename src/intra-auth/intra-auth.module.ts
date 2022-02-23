import { UserModule } from '@user/user.module';
import { Module } from '@nestjs/common';
import { IntraAuthService } from './intra-auth.service';
import { IntraAuthController } from './intra-auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntraAuth } from '@intra-auth/entities/intra-auth.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([IntraAuth])],
  controllers: [IntraAuthController],
  providers: [IntraAuthService],
})
export class IntraAuthModule {}
