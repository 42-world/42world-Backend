import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateArticleRequestDto {
  @MaxLength(42)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '제목 입니다.' })
  title: string;

  @MaxLength(4242)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '내용 입니다.' })
  content: string;

  @Min(0)
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  categoryId: number;
}
