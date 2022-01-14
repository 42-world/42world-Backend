import { Module } from '@nestjs/common';
import { BestService } from './best.service';
import { BestController } from './best.controller';

@Module({
  controllers: [BestController],
  providers: [BestService]
})
export class BestModule {}
