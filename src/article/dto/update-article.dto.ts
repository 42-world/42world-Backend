// import { PartialType } from '@nestjs/mapped-types';
// import { CreateUserDto } from './create-user.dto';

// export class UpdateArticleDto extends PartialType(CreateArticleDto) {
export class UpdateArticleDto {
  readonly title?: string;
  readonly content?: string;
  readonly category_id?: number;
}
