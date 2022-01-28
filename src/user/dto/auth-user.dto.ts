import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { User } from '../entities/user.entity';

export class AuthUserDto extends User {
  @IsBoolean()
  @ApiProperty({ example: 'true' })
  isAuthenticated?: boolean;
}
