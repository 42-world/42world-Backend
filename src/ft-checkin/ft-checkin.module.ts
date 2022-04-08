import { Module } from '@nestjs/common';
import { FtCheckinService } from './ft-checkin.service';
import { FtCheckinController } from './ft-checkin.controller';
import { CacheModule } from '@cache/cache.module';

@Module({
  imports: [CacheModule],
  controllers: [FtCheckinController],
  providers: [FtCheckinService],
})
export class FtCheckinModule {}
