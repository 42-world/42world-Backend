import { UserProfileResponseDto } from '@api/user/dto/response/user-profile-response.dto';
import { IntraAuth } from '@app/entity/intra-auth/intra-auth.entity';
import { User } from '@app/entity/user/user.entity';

export class UserProfileMapper {
  static async toMapResponse(user: User, intraAuth?: IntraAuth): Promise<UserProfileResponseDto> {
    return new UserProfileResponseDto(user.id, user.nickname, user.role, user.character, intraAuth.intraId);
  }
}
