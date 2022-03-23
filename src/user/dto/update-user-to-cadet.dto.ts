import { IsString, IsNotEmpty } from 'class-validator';
import { UserRole } from '@user/interfaces/userrole.interface';

export class UpdateToCadetDto {
  @IsString()
  @IsNotEmpty()
  readonly role: UserRole;

  @IsString()
  @IsNotEmpty()
  readonly nickname: string;
}
