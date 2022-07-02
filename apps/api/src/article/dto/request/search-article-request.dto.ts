import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SearchArticleRequestDto extends PaginationRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '검색할 단어' })
  readonly q: string;
}
