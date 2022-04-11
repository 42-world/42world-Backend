import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateToCadetDto {
  @IsString()
  @IsNotEmpty()
  readonly role: UserRole;

  @IsString()
  @IsNotEmpty()
  readonly nickname: string;
}
