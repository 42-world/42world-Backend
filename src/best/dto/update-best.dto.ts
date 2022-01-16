import { PartialType } from '@nestjs/mapped-types';
import { CreateBestDto } from './create-best.dto';

export class UpdateBestDto extends PartialType(CreateBestDto) {}
