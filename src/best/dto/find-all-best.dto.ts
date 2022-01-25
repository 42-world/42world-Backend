import { IsNumberString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindAllBestDto {
  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional({ example: 5 })
  readonly limit?: number;
}
