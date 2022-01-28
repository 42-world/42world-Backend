import {
  IsString,
  IsInt,
  IsNotEmpty,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(420)
  @ApiProperty({ example: '댓글 입니다.' })
  readonly content!: string;

  @IsInt()
  @Min(0)
  @ApiProperty({ example: 1 })
  readonly articleId!: number;
}
