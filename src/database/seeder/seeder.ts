import { Injectable } from '@nestjs/common';

import { UserSeederService } from './user/user-seeder.service';
import { CategorySeederService } from './category/category-seeder.service';

@Injectable()
export class Seeder {
  constructor(
    private readonly userSeederService: UserSeederService,
    private readonly categorySeederService: CategorySeederService,
  ) {}

  async seed() {
    await Promise.all([
      this.userSeederService.create(),
      this.categorySeederService.create(),
    ]);
  }
}
