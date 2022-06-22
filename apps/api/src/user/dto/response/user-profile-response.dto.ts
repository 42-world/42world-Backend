import { BaseUserResponseDto } from '@api/user/dto/response/base-user-response.dto';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserProfileResponseDto extends BaseUserResponseDto {
  @IsString()
  @ApiProperty({ required: false, example: 'chlim' })
  intraId: string | null;

  constructor(id: number, nickname: string, role: UserRole, character: number, intraId: string | null) {
    super(id, nickname, role, character);
    this.intraId = intraId;
  }
}
