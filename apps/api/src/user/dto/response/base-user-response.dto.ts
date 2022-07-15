import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, Min } from 'class-validator';

export class BaseUserResponseDto {
  @ApiProperty()
  id!: number;

  @IsString()
  @ApiProperty()
  nickname!: string;

  @IsString()
  @ApiProperty()
  githubUsername!: string;

  @IsString()
  @ApiProperty({ example: UserRole.NOVICE })
  role!: UserRole;

  @IsInt()
  @Min(0)
  @Max(10)
  @ApiProperty({
    minimum: 0,
    maximum: 10,
  })
  character!: number;

  constructor(id: number, nickname: string, githubUsername: string, role: UserRole, character: number) {
    this.id = id;
    this.nickname = nickname;
    this.githubUsername = githubUsername;
    this.role = role;
    this.character = character;
  }
}
