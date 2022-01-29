import { Module } from '@nestjs/common';
import { FtCheckinService } from './ft-checkin.service';
import { FtCheckinController } from './ft-checkin.controller';

@Module({
  controllers: [FtCheckinController],
  providers: [FtCheckinService],
})
export class FtCheckinModule {}
