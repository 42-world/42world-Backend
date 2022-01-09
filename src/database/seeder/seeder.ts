import { Injectable } from '@nestjs/common';

import { UserSeederService } from './user/user-seeder.service';

@Injectable()
export class Seeder {
  constructor(private readonly userSeederService: UserSeederService) {}

  async seed() {
    await this.userSeederService.create();
  }
}
