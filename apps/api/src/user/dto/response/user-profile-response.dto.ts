import { BaseUserResponseDto } from '@api/user/dto/response/base-user-response.dto';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserProfileResponseDto extends BaseUserResponseDto {
  @IsString()
  @ApiProperty({ required: false, example: 'chlim', nullable: true })
  intraId: string | null;

  constructor(
    id: number,
    nickname: string,
    githubUsername: string,
    role: UserRole,
    character: number,
    intraId: string | null,
  ) {
    super(id, nickname, githubUsername, role, character);
    this.intraId = intraId;
  }
}
