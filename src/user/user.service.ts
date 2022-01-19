import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { getNextMonth } from '@root/utils';
import { GithubProfile } from '@root/auth/interfaces/github-profile.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async githubLogin(profile: GithubProfile): Promise<User> {
    const user = await this.userRepository.findOne({ oauth_token: profile.id });

    if (user) {
      user.last_login = getNextMonth();
      return this.userRepository.save(user);
    }

    const newUser: CreateUserDto = {
      nickname: profile.nickname,
      oauth_token: profile.id,
      last_login: getNextMonth(),
    };

    return this.userRepository.save(newUser);
  }

  async getOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneOrFail(id);

    if (!user) {
      throw new NotFoundException(`Can't find User with id ${id}`);
    }
    return user;
  }

  isExistById(id: number): Promise<boolean> {
    return this.userRepository.isExistById(id);
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
