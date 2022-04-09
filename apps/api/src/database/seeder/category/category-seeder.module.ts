import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { CategorySeederService } from './category-seeder.service';
import { Category } from '@api/category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategorySeederService],
  exports: [CategorySeederService],
})
export class CategorySeederModule {}
