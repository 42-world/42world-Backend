import { Module } from '@nestjs/common';
import { BatchController } from './batch.controller';

@Module({
  controllers: [BatchController],
})
export class BatchModule {}
