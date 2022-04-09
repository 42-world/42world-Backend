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
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Admin, GetUser } from '@api/auth/auth.decorator';
import { User } from '@api/user/entities/user.entity';
import { CategoryService } from './category.service';
import { CreateCategoryRequestDto } from './dto/request/create-category-request.dto';
import { CategoryResponseDto } from './dto/response/category-response.dto';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('Category')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Admin()
  @ApiOperation({ summary: '카테고리 생성하기 (관리자)' })
  @ApiCreatedResponse({ description: '카테고리', type: CategoryResponseDto })
  @ApiForbiddenResponse({ description: '접근 권한 없음' })
  async create(
    @GetUser() user: User,
    @Body() createCategoryDto: CreateCategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryService.create(createCategoryDto);

    return CategoryResponseDto.of({ category, user });
  }

  @Get()
  @ApiOperation({ summary: '카테고리 종류 가져오기' })
  @ApiOkResponse({
    description: '카테고리 종류',
    type: [CategoryResponseDto],
  })
  async findAll(@GetUser() user: User): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryService.findAll();

    return categories.map((category) =>
      CategoryResponseDto.of({ category, user }),
    );
  }

  @Put(':id/name')
  @Admin()
  @ApiOperation({ summary: '카테고리 이름 수정하기 (관리자)' })
  @ApiOkResponse({ description: '카테고리', type: CreateCategoryRequestDto })
  @ApiForbiddenResponse({ description: '접근 권한 없음' })
  @ApiNotFoundResponse({ description: '카테고리 없음' })
  async updateName(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body('name') name: string,
  ): Promise<CreateCategoryRequestDto> {
    const category = await this.categoryService.updateName(id, name);

    return CategoryResponseDto.of({ category, user });
  }

  @Delete(':id')
  @Admin()
  @ApiOperation({ summary: '카테고리 삭제하기 (관리자)' })
  @ApiOkResponse({ description: '카테고리 삭제 성공' })
  @ApiForbiddenResponse({ description: '접근 권한 없음' })
  @ApiNotFoundResponse({ description: '카테고리 없음' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void | never> {
    return this.categoryService.remove(id);
  }
}
