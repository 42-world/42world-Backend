import { Auth } from '@api/auth/auth.decorator';
import { UploadImageUrlResponseDto } from '@api/image/dto/upload-image-url-response.dto';
import { ImageService } from '@api/image/image.service';
import { Controller, HttpCode, Post } from '@nestjs/common';
import { ApiCookieAuth, ApiCreatedResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @Auth()
  @HttpCode(200)
  @ApiOperation({ summary: '이미지 업로드 URL 생성' })
  @ApiCreatedResponse({
    description: '생성된 업로드 URL',
    type: UploadImageUrlResponseDto,
  })
  async createUploadURL(): Promise<UploadImageUrlResponseDto> {
    const uploadUrl = await this.imageService.createUploadURL();
    return new UploadImageUrlResponseDto(uploadUrl);
  }
}
