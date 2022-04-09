import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { User } from '@api/user/entities/user.entity';
import { UserSeederService } from './user-seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserSeederService],
  exports: [UserSeederService],
})
export class UserSeederModule {}
