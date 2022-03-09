import { IsString, IsNotEmpty } from 'class-validator';
import { UserRole } from '@user/interfaces/userrole.interface';

export class UpdateRoleDto {
  @IsString()
  @IsNotEmpty()
  readonly role: UserRole;
}
