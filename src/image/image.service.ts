import { Injectable } from '@nestjs/common';
import { InjectAwsService } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { S3_URL_EXPIRATION_SECONDS } from '@root/config/constants';
import { S3Param } from '@image/interfaces/s3-param.interface';

@Injectable()
export class ImageService {
  constructor(@InjectAwsService(S3) private readonly s3: S3) {}

  createUploadURL(): Promise<string> {
    const randomId = Math.random() * 10000000;
    const key = `${randomId}.png`;

    const s3Params: S3Param = {
      Bucket: process.env.AWS_S3_UPLOAD_BUCKET,
      Key: key,
      Expires: S3_URL_EXPIRATION_SECONDS,
      ContentType: 'image/png',
      ACL: 'public-read',
    };

    return this.s3.getSignedUrlPromise('putObject', s3Params);
  }
}
