import { PickType } from '@nestjs/swagger';
import { BaseBestDto } from '../base-best.dto';

export class CreateBestRequestDto extends PickType(BaseBestDto, ['articleId']) {}
