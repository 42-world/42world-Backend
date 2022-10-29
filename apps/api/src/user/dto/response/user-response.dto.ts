import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { User } from '@app/entity/user/user.entity';
import { PickType } from '@nestjs/swagger';
import {
  ANONY_USER_CHARACTER,
  ANONY_USER_DATE,
  ANONY_USER_ID,
  ANONY_USER_NICKNAME,
  ANONY_USER_ROLE,
} from '../../user.constant';
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

  static of({ user, isAnonymous = false }: { user: User; isAnonymous?: boolean }): UserResponseDto {
    if (isAnonymous) {
      return new UserResponseDto({
        id: ANONY_USER_ID,
        nickname: ANONY_USER_NICKNAME,
        role: ANONY_USER_ROLE,
        character: ANONY_USER_CHARACTER,
        createdAt: ANONY_USER_DATE,
        updatedAt: ANONY_USER_DATE,
      });
    }

    return new UserResponseDto(user);
  }
}
