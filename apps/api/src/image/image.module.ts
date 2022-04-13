import { ImageController } from '@api/image/image.controller';
import { ImageService } from '@api/image/image.service';
import { Module } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { AwsSdkModule } from 'nest-aws-sdk';

@Module({
  imports: [AwsSdkModule.forFeatures([S3])],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [],
})
export class ImageModule {}
