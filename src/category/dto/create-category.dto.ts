import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @IsString()
  @ApiProperty({ example: '유머게시판' })
  readonly name!: string;
}
