import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBestDto {
  @IsInt()
  @Min(0)
  @ApiProperty({ example: 1 })
  readonly articleId!: number;
}
