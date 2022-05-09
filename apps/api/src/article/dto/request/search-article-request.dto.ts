import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator/types/decorator/common/IsNotEmpty';
import { IsString } from 'class-validator/types/decorator/typechecker/IsString';

export class SearchArticleRequestDto extends PaginationRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '검색할 단어' })
  readonly q: string;
}
