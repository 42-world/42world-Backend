import { IsString, IsInt, Min, Max } from 'class-validator';
export class UpdateUserDto {
  @IsString()
  readonly nickname?: string;

  @IsInt()
  @Min(0)
  @Max(4)
  readonly character?: number;
}
