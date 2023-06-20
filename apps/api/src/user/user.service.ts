import { User } from '@app/entity/user/user.entity';
import { Injectable } from '@nestjs/common';
import { UpdateUserProfileRequestDto } from './dto/request/update-user-profile-request.dto';
import { UpdateToCadetDto } from './dto/update-user-to-cadet.dto';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async findOneByGithubUId(githubUid: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { githubUid } });
  }

  async findOneByIdOrFail(id: number): Promise<User | never> {
    return this.userRepository.findOneOrFail({ where: { id } });
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
