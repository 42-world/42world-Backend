import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class FindAllArticleRequestDto extends PaginationRequestDto {
  @Min(0)
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  categoryId: number;
}
