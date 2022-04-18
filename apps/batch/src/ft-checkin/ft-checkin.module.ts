import { CacheModule } from '@app/common/cache/cache.module';
import { Module } from '@nestjs/common';
import { FtCheckinService } from './ft-checkin.service';

@Module({
  imports: [CacheModule],
  providers: [FtCheckinService],
})
export class FtCheckinModule {}
