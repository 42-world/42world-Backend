import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '수정된 댓글 입니다.' })
  readonly content!: string;
}
