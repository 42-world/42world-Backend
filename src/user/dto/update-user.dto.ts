import {
  IsString,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsBoolean,
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

export class UpdateAuthDto {
  @IsBoolean()
  @IsNotEmpty()
  readonly isAuthenticated: boolean;

  @IsString()
  @IsNotEmpty()
  readonly role: UserRole;
}
