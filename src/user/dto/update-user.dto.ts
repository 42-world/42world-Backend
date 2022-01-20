import { IsString, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'minsu' })
  @IsString()
  readonly nickname?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsInt()
  @Min(0)
  @Max(4)
  readonly character?: number;
}
