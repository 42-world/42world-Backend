import { CacheModule } from '@app/common/cache/cache.module';
import { Module } from '@nestjs/common';
import { FtCheckinController } from './ft-checkin.controller';
import { FtCheckinService } from './ft-checkin.service';

@Module({
  imports: [CacheModule],
  controllers: [FtCheckinController],
  providers: [FtCheckinService],
})
export class FtCheckinModule {}
