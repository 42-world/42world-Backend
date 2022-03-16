import { Injectable } from '@nestjs/common';
import { getNextMonth } from '@root/utils';
import { GithubProfile } from '@auth/interfaces/github-profile.interface';
import { UserRepository } from './repositories/user.repository';
import { UpdateUserDto, UpdateToCadetDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

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

  getOne(id: number): Promise<User> {
    return this.userRepository.findOneOrFail(id);
  }

  async updateProfile(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userRepository.save({
      ...user,
      ...updateUserDto,
    });
  }

  async updateToCadet(
    user: User,
    updateToCadetDto: UpdateToCadetDto,
  ): Promise<User> {
    return this.userRepository.save({ ...user, ...updateToCadetDto });
  }

  async update(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.softDelete({ id });
  }
}
