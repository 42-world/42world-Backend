import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SigninIntraAuthRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'ycha' })
  readonly intraId!: string;
}
