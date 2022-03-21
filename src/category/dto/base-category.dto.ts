import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@root/user/interfaces/userrole.interface';

export class BaseCategoryDto {
  @ApiProperty()
  id!: number;

  @IsString()
  @MaxLength(40)
  @ApiProperty()
  name!: string;

  @ApiProperty({ example: UserRole.CADET })
  writableArticle!: string;

  @ApiProperty({ example: UserRole.CADET })
  readableArticle!: string;

  @ApiProperty({ example: UserRole.CADET })
  writableComment!: string;

  @ApiProperty({ example: UserRole.CADET })
  readableComment!: string;

  @ApiProperty({ example: UserRole.CADET })
  reactionable!: string;

  @ApiProperty()
  isAnonymous!: boolean;
}
