import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(github: any) {
    console.log('one more time!!!!!!!!');
    const user = await this.userRepository.findOne({ oauth_token: github.id });
    console.log('user == ', user);
    if (!user) {
      const newUser = {
        nickname: github.nickname,
        oauth_token: github.id,
        refresh_token: new Date(),
      };
      await this.userRepository.save(newUser);
      console.log('saved!!!!');
    }
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
