import { PartialType } from '@nestjs/mapped-types';
import { CreateSlackDto } from './create-slack.dto';

export class UpdateSlackDto extends PartialType(CreateSlackDto) {}
