import { PickType } from '@nestjs/swagger';
import { BaseCategoryDto } from '../base-category.dto';

export class CreateCategoryRequestDto extends PickType(BaseCategoryDto, ['name']) {}
