import { ApiProperty } from '@nestjs/swagger';

export class UploadImageUrlResponseDto {
  @ApiProperty()
  uploadUrl!: string;

  constructor(uploadUrl: string) {
    this.uploadUrl = uploadUrl;
  }
}
