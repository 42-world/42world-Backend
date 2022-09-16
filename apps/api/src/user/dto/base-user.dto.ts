import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, Min } from 'class-validator';

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
  @Max(11)
  @ApiProperty({
    minimum: 0,
    maximum: 11,
  })
  character!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty()
  deletedAt?: Date;
}
