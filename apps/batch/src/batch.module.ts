import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BatchController } from './batch.controller';
import { FtCheckinModule } from './ft-checkin/ft-checkin.module';

@Module({
  imports: [ScheduleModule.forRoot(), FtCheckinModule],
  controllers: [BatchController],
})
export class BatchModule {}
