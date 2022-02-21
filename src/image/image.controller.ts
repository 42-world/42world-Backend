import { Controller, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ImageService } from '@image/image.service';
import { UploadImageUrlResponseDto } from '@image/dto/upload-image-url-response.dto';

@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @ApiOperation({ summary: '이미지 업로드 URL 생성' })
  @ApiOkResponse({
    description: '생성된 업로드 URL',
    type: UploadImageUrlResponseDto,
  })
  async createUploadURL(): Promise<UploadImageUrlResponseDto> {
    const uploadUrl = await this.imageService.createUploadURL();
    return new UploadImageUrlResponseDto(uploadUrl);
  }
}
