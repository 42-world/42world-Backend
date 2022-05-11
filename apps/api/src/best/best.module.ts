import { ArticleModule } from '@api/article/article.module';
import { Best } from '@app/entity/best/best.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BestController } from './best.controller';
import { BestService } from './best.service';

@Module({
  imports: [ArticleModule, TypeOrmModule.forFeature([Best])],
  controllers: [BestController],
  providers: [BestService],
})
export class BestModule {}
