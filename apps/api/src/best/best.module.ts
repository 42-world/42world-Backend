import { ArticleModule } from '@api/article/article.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BestController } from './best.controller';
import { BestService } from './best.service';
import { BestRepository } from './repositories/best.repository';

@Module({
  imports: [ArticleModule, TypeOrmModule.forFeature([BestRepository])],
  controllers: [BestController],
  providers: [BestService],
})
export class BestModule {}
