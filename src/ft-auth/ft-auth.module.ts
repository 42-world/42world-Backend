import { MailService } from './../mail/mail.service';
import { Module } from '@nestjs/common';
import { FtAuthService } from './ft-auth.service';
import { FtAuthController } from './ft-auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FtAuth } from './entities/ft-auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FtAuth])],
  controllers: [FtAuthController],
  providers: [FtAuthService, MailService],
})
export class FtAuthModule {}
