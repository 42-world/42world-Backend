import { UserModule } from '@user/user.module';
import { Module } from '@nestjs/common';
import { IntraAuthService } from './intra-auth.service';
import { IntraAuthController } from './intra-auth.controller';

@Module({
  imports: [UserModule],
  controllers: [IntraAuthController],
  providers: [IntraAuthService],
})
export class IntraAuthModule {}
