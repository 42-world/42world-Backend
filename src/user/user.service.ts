import { Injectable } from '@nestjs/common';
import { getNextMonth } from '@root/utils';
import { GithubProfile } from '@auth/interfaces/github-profile.interface';
import { UserRepository } from './repositories/user.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async githubLogin(profile: GithubProfile): Promise<User> {
    const user = await this.userRepository.findOne({ oauth_token: profile.id });

    if (user) {
      user.last_login = getNextMonth();
      return this.userRepository.save(user);
    }

    const newUser = {
      nickname: profile.nickname,
      oauth_token: profile.id,
      last_login: getNextMonth(),
    };

    return this.userRepository.save(newUser);
  }

  getOne(id: number): Promise<User> {
    return this.userRepository.findOneOrFail(id);
  }

  async update(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    const newUser: User = {
      ...user,
      ...updateUserDto,
    };
    return this.userRepository.save(newUser);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete({ id });
  }
}
