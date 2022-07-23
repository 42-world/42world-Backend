import { UserProfileResponseDto } from '@api/user/dto/response/user-profile-response.dto';
import { IntraAuth } from '@app/entity/intra-auth/intra-auth.entity';
import { User } from '@app/entity/user/user.entity';

export class UserProfileMapper {
  static toMapResponse(user: User, intraAuth?: IntraAuth | null): UserProfileResponseDto {
    return new UserProfileResponseDto(
      user.id,
      user.nickname,
      user.githubUsername,
      user.role,
      user.character,
      intraAuth?.intraId,
    );
  }
}
