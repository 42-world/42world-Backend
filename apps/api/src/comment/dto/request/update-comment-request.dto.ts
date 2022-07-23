import { ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { BaseCommentDto } from '../base-comment.dto';

export class UpdateCommentRequestDto extends PickType(PartialType(BaseCommentDto), ['content']) {
  @IsOptional()
  @ApiPropertyOptional({ example: '수정된 내용 입니다.' })
  readonly content?: string;
}
