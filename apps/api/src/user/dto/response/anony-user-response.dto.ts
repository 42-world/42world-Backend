import { ANONY_USER_CHARACTER, ANONY_USER_ID, ANONY_USER_NICKNAME } from '@api/user/user.constant';
import { PickType } from '@nestjs/swagger';
import { BaseUserDto } from '../base-user.dto';

export class AnonyUserResponseDto extends PickType(BaseUserDto, ['id', 'nickname', 'character']) {
  constructor(config: { nickname: string }) {
    super();

    this.id = ANONY_USER_ID;
    this.nickname = config.nickname;
    this.character = ANONY_USER_CHARACTER;
  }

  static of(nickname = ANONY_USER_NICKNAME): AnonyUserResponseDto {
    return new AnonyUserResponseDto({
      nickname,
    });
  }
}
