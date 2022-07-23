import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BatchController } from './batch.controller';
import { FtCheckinModule } from './ft-checkin/ft-checkin.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: 'infra/config/.env',
      isGlobal: true,
      cache: true,
    }),
    FtCheckinModule,
  ],
  controllers: [BatchController],
})
export class BatchModule {}
