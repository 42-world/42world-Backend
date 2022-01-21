import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthenticateDto } from './dto/create-authenticate.dto';
import { UpdateAuthenticateDto } from './dto/update-authenticate.dto';
import { Authenticate } from './entities/authenticate.entity';

@Injectable()
export class AuthenticateService {
  constructor(
    @InjectRepository(Authenticate)
    private readonly authenticateRepository: Repository<Authenticate>,
  ) {}

  create(createAuthenticateDto: CreateAuthenticateDto): Promise<Authenticate> {
    return this.authenticateRepository.save(createAuthenticateDto);
  }

  getByIntraId(intraId: string): Promise<Authenticate> {
    return this.authenticateRepository.findOne({ where: { intraId } });
  }

  async removeByUserId(userId: number): Promise<void> {
    const result = await this.authenticateRepository.delete({ userId });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Can't find Authenticate with user id ${userId}`,
      );
    }
  }
}
