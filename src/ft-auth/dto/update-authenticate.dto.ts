import { PartialType } from '@nestjs/mapped-types';
import { CreateFtAuthDto } from './create-ft-auth.dto';

export class UpdateAuthenticateDto extends PartialType(CreateFtAuthDto) {}
