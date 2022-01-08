import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthenticateDto } from './create-authenticate.dto';

export class UpdateAuthenticateDto extends PartialType(CreateAuthenticateDto) {}
