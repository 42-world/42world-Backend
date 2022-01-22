import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFtAuthDto } from './dto/create-ft-auth.dto';
import { UpdateAuthenticateDto } from './dto/update-authenticate.dto';
import { FtAuth } from './entities/ft-auth.entity';

@Injectable()
export class FtAuthService {
  constructor(
    @InjectRepository(FtAuth)
    private readonly authenticateRepository: Repository<FtAuth>,
  ) {}

  create(CreateFtAuthDto: CreateFtAuthDto): Promise<FtAuth> {
    return this.authenticateRepository.save(CreateFtAuthDto);
  }

  getByIntraId(intraId: string): Promise<FtAuth> {
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
