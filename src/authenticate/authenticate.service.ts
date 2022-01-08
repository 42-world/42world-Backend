import { Injectable } from '@nestjs/common';
import { CreateAuthenticateDto } from './dto/create-authenticate.dto';
import { UpdateAuthenticateDto } from './dto/update-authenticate.dto';

@Injectable()
export class AuthenticateService {
  create(createAuthenticateDto: CreateAuthenticateDto) {
    return 'This action adds a new authenticate';
  }

  findAll() {
    return `This action returns all authenticate`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authenticate`;
  }

  update(id: number, updateAuthenticateDto: UpdateAuthenticateDto) {
    return `This action updates a #${id} authenticate`;
  }

  remove(id: number) {
    return `This action removes a #${id} authenticate`;
  }
}
