import { PickType } from '@nestjs/swagger';
import { BaseCommentDto } from '../base-comment.dto';

export class CreateCommentRequestDto extends PickType(BaseCommentDto, ['content', 'articleId']) {}
