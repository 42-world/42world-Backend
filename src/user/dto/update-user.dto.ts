import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'minsu' })
  readonly nickname?: string;

  @IsInt()
  @Min(0)
  @Max(4)
  @IsOptional()
  @ApiPropertyOptional({ example: 0 })
  readonly character?: number;
}
