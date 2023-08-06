import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, MaxLength } from 'class-validator';

export class UpdateCommentRequestDto {
  @IsOptional()
  @MaxLength(420)
  @ApiPropertyOptional({ example: '수정된 내용 입니다.' })
  readonly content?: string;
}
