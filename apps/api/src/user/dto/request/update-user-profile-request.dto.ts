import { ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { BaseUserDto } from '../base-user.dto';

export class UpdateUserProfileRequestDto extends PickType(PartialType(BaseUserDto), ['nickname', 'character']) {
  @IsOptional()
  @ApiPropertyOptional()
  nickname?: string;

  @IsOptional()
  @ApiPropertyOptional()
  character?: number;
}
