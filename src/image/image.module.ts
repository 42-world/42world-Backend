import { Module } from '@nestjs/common';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { ImageService } from '@root/image/image.service';
import { ImageController } from '@root/image/image.controller';

@Module({
  imports: [AwsSdkModule.forFeatures([S3])],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [],
})
export class ImageModule {}
