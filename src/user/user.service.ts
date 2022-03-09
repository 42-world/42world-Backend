import { Injectable } from '@nestjs/common';
import { getNextMonth } from '@root/utils';
import { GithubProfile } from '@auth/interfaces/github-profile.interface';
import { UserRepository } from './repositories/user.repository';
import { UpdateRoleDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserProfileRequestDto } from './dto/request/update-user-profile-request.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async githubLogin(profile: GithubProfile): Promise<User> {
    const user = await this.userRepository.findOne({ oauthToken: profile.id });

    if (user) {
      user.lastLogin = getNextMonth();
      return this.userRepository.save(user);
    }

    const newUser = {
      nickname: profile.nickname,
      oauthToken: profile.id,
      lastLogin: getNextMonth(),
    };

    return this.userRepository.save(newUser);
  }

  getOne(id: number): Promise<User> {
    return this.userRepository.findOneOrFail(id);
  }

  async updateProfile(
    user: User,
    updateUserProfileDto: UpdateUserProfileRequestDto,
  ): Promise<User> {
    const newUser: User = {
      ...user,
      ...updateUserProfileDto,
    };

    return this.userRepository.save(newUser);
  }

  async updateAuthenticate(
    user: User,
    updateRoleDto: UpdateRoleDto,
  ): Promise<User> {
    return this.userRepository.save({ ...user, ...updateRoleDto });
  }

  async update(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.softDelete({ id });
  }
}
