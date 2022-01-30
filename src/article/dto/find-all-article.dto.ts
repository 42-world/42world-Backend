import { IsNumberString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from '@root/pagination/page-options.dto';

export class FindAllArticleDto extends PageOptionsDto {
  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional({ example: 1 })
  readonly categoryId?: number;
}
