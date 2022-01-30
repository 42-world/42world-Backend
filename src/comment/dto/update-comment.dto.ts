import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(420)
  @ApiProperty({ example: '수정된 댓글 입니다.' })
  readonly content!: string;
}
