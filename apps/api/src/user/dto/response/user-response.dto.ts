import { PickType } from '@nestjs/swagger';
import { User } from '@api/user/entities/user.entity';
import { UserRole } from '@api/user/interfaces/userrole.interface';
import { BaseUserDto } from '../base-user.dto';

export class UserResponseDto extends PickType(BaseUserDto, [
  'id',
  'nickname',
  'role',
  'character',
  'createdAt',
  'updatedAt',
]) {
  constructor(config: {
    id: number;
    nickname: string;
    role: UserRole;
    character: number;
    createdAt: Date;
    updatedAt: Date;
  }) {
    super();

    this.id = config.id;
    this.nickname = config.nickname;
    this.role = config.role;
    this.character = config.character;
    this.createdAt = config.createdAt;
    this.updatedAt = config.updatedAt;
  }

  static of(config: { user: User }): UserResponseDto {
    return new UserResponseDto({
      ...config.user,
      role: config.user.role as UserRole,
    });
  }
}
