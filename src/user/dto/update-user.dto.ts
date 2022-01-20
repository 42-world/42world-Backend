import { IsString, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsString()
  @ApiPropertyOptional({ example: 'minsu' })
  readonly nickname?: string;

  @IsInt()
  @Min(0)
  @Max(4)
  @ApiPropertyOptional({ example: 0 })
  readonly character?: number;
}
