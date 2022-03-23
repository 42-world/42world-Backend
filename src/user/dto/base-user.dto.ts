import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, Min } from 'class-validator';
import { UserRole } from '../interfaces/userrole.interface';

export class BaseUserDto {
  @ApiProperty()
  id!: number;

  @IsString()
  @ApiProperty()
  nickname!: string;

  @IsString()
  @ApiProperty({ example: UserRole.NOVICE })
  role!: UserRole;

  @IsInt()
  @Min(0)
  @Max(4)
  @ApiProperty({
    minimum: 0,
    maximum: 5,
  })
  character!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty()
  deletedAt?: Date;
}
