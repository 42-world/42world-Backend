import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { getNextMonth } from '@root/utils';
import { githubProfile } from '@root/auth/interfaces/github-profile.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(profile: githubProfile): Promise<User> {
    const user = await this.userRepository.findOne({ oauth_token: profile.id });

    if (user) {
      user.refresh_token = getNextMonth();
      return this.userRepository.save(user);
    }

    const newUser = {
      nickname: profile.nickname,
      oauth_token: profile.id,
      refresh_token: getNextMonth(),
    };

    return this.userRepository.save(newUser);
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
