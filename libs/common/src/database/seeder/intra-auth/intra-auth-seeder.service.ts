import { intraAuthData } from '@app/common/database/seeder/intra-auth/data';
import { IntraAuth } from '@app/entity/intra-auth/intra-auth.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class IntraAuthSeederService {
  constructor(
    @InjectRepository(IntraAuth)
    private readonly intraRepository: Repository<IntraAuth>,
  ) {}

  create() {
    return this.intraRepository.save(intraAuthData);
  }
}
