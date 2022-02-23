import {
  IsString,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

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

export class UpdateIntraAuthDto {
  @IsString()
  @IsNotEmpty()
  readonly role: UserRole;

  @IsString()
  @IsNotEmpty()
  readonly nickname: string;
}
