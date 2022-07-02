import { GithubProfile } from '@api/auth/interfaces/github-profile.interface';
import { User } from '@app/entity/user/user.entity';
import { getNextMonth } from '@app/utils/utils';
import { Injectable } from '@nestjs/common';
import { UpdateUserProfileRequestDto } from './dto/request/update-user-profile-request.dto';
import { UpdateToCadetDto } from './dto/update-user-to-cadet.dto';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async githubLogin(githubProfile: GithubProfile): Promise<User> {
    const user = await this.userRepository.findOne({
      githubUid: githubProfile.id,
    });

    if (user) {
      user.lastLogin = getNextMonth();
      return this.userRepository.save(user);
    }

    const newUser = {
      nickname: githubProfile.username,
      githubUsername: githubProfile.username,
      githubUid: githubProfile.id,
      lastLogin: getNextMonth(),
    };

    return this.userRepository.save(newUser);
  }

  async findOneByIdOrFail(id: number): Promise<User | never> {
    return this.userRepository.findOneOrFail(id);
  }

  async updateProfile(user: User, updateUserProfileDto: UpdateUserProfileRequestDto): Promise<User> {
    return this.userRepository.save({
      ...user,
      ...updateUserProfileDto,
    });
  }

  async updateToCadet(user: User, updateToCadetDto: UpdateToCadetDto): Promise<User> {
    return this.userRepository.save({ ...user, ...updateToCadetDto });
  }

  async update(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.softDelete({ id });
  }
}
