import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '@api/user/entities/user.entity';
import { users } from './data';

@Injectable()
export class UserSeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create() {
    return this.userRepository.save(users);
  }
}
