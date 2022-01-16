import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { getNextMonth } from '@root/utils';
import { githubProfile } from '@root/auth/interfaces/github-profile.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async githubLogin(profile: githubProfile): Promise<User> {
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

  findAll(): Promise<User[]> {
    return this.userRepository.find();
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

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.getOne(id);
    const new_user = {
      ...user,
      ...updateUserDto,
    };

    return this.userRepository.save(new_user);
  }

  async refreshToken(user: User, updateTime: Date): Promise<User> {
    return this.userRepository.save({ ...user, refresh_token: updateTime });
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find User with id ${id}`);
    }
  }
}
