import { Category } from '@app/entity/category/category.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorySeederService } from './category-seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategorySeederService],
  exports: [CategorySeederService],
})
export class CategorySeederModule {}
