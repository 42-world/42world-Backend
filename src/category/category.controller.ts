import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Admin } from '@root/auth/auth.decorator';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('Category')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Admin()
  @ApiOperation({ summary: '카테고리 생성하기 (관리자)' })
  @ApiOkResponse({ description: '카테고리', type: Category })
  @ApiForbiddenResponse({ description: '접근 권한 없음' })
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: '카테고리 종류 가져오기' })
  @ApiOkResponse({ description: '카테고리 종류', type: [Category] })
  getAll(): Promise<Category[]> {
    return this.categoryService.getAll();
  }

  @Put(':id/name')
  @Admin()
  @ApiOperation({ summary: '카테고리 이름 수정하기 (관리자)' })
  @ApiOkResponse({ description: '카테고리', type: Category })
  @ApiForbiddenResponse({ description: '접근 권한 없음' })
  updateName(
    @Param('id', ParseIntPipe) id: number,
    @Body('name') name: string,
  ): Promise<Category> {
    return this.categoryService.updateName(id, name);
  }

  @Delete(':id')
  @Admin()
  @ApiOperation({ summary: '카테고리 삭제하기 (관리자)' })
  @ApiOkResponse({ description: '카테고리 삭제 성공' })
  @ApiForbiddenResponse({ description: '접근 권한 없음' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoryService.remove(id);
  }
}
