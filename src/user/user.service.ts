import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);

    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException(`Can't find User with id ${id}`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const new_user = {
      ...user,
      ...updateUserDto,
    };

    return this.userRepository.save(new_user);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find User with id ${id}`);
    }
  }
}
