import { IsNumberString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from '@root/pagination/page-options.dto';

export class FindAllCommentDto extends PageOptionsDto {
  @IsNumberString()
  @ApiPropertyOptional({ example: 1 })
  readonly articleId?: number;
}
