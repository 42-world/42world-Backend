import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repositories/user.repository';
import { NotificationModule } from '@root/notification/notification.module';
import { ReactionModule } from '@root/reaction/reaction.module';

@Module({
  imports: [
    NotificationModule,
    ReactionModule,
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
