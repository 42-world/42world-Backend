import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateCommentRequestDto {
  @IsString()
  @MaxLength(420)
  @IsNotEmpty()
  @ApiProperty({ example: '댓글 입니다.' })
  content!: string;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  articleId!: number;
}
