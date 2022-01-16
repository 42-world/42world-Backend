import { Module } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';
import { AuthenticateController } from './authenticate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Authenticate } from './entities/authenticate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Authenticate])],
  controllers: [AuthenticateController],
  providers: [AuthenticateService],
})
export class AuthenticateModule {}
