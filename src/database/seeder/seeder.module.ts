import { Module, Logger } from '@nestjs/common';

import { UserSeederModule } from './user/user-seeder.module';
import { DatabaseModule } from '@database/database.module';
import { Seeder } from './seeder';

@Module({
  imports: [DatabaseModule, UserSeederModule],
  providers: [Logger, Seeder],
})
export class SeederModule {}
