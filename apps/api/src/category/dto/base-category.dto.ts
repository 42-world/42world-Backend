import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class BaseCategoryDto {
  @ApiProperty()
  id!: number;

  @IsString()
  @MaxLength(40)
  @ApiProperty()
  name!: string;

  @ApiProperty({ example: UserRole.CADET })
  writableArticle!: UserRole;

  @ApiProperty({ example: UserRole.CADET })
  readableArticle!: UserRole;

  @ApiProperty({ example: UserRole.CADET })
  writableComment!: UserRole;

  @ApiProperty({ example: UserRole.CADET })
  readableComment!: UserRole;

  @ApiProperty({ example: UserRole.CADET })
  reactionable!: UserRole;

  @ApiProperty()
  isAnonymous!: boolean;
}
