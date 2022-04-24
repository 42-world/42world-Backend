import { ApiProperty } from '@nestjs/swagger';

export class FtCheckinDto {
  @ApiProperty({ example: 42 })
  gaepo: number;

  @ApiProperty({ example: 0 })
  seocho: number;
}
