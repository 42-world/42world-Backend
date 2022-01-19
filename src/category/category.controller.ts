import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { Admin } from '@root/auth/auth.decorator';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Admin()
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  getAll(): Promise<Category[]> {
    return this.categoryService.getAll();
  }

  @Put(':id/name')
  @Admin()
  updateName(
    @Param('id') id: number,
    @Body('name') name: string,
  ): Promise<Category> {
    return this.categoryService.updateName(id, name);
  }

  @Delete(':id')
  @Admin()
  remove(@Param('id') id: number): Promise<void> {
    return this.categoryService.remove(id);
  }
}
