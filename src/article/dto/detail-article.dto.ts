import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Article } from '../entities/article.entity';

export class DetailArticleDto extends Article {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: 'true' })
  isLike?: boolean;
}
