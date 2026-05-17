import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly logger = new Logger(StorageService.name);

  constructor(private config: ConfigService) {
    this.bucket = config.get('R2_BUCKET_NAME', 'classitivity-content');

    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${config.get('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.get('R2_ACCESS_KEY_ID', ''),
        secretAccessKey: config.get('R2_SECRET_ACCESS_KEY', ''),
      },
    });
  }

  /**
   * Upload a file to Cloudflare R2
   * Key format: classitivity/{version}/{grade}/{subject}/{term}/{lesson}/{type}.{ext}
   */
  async uploadFile(
    key: string,
    body: Buffer,
    mimeType: string,
  ): Promise<{ key: string; size: number }> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
      ContentType: mimeType,
    });

    await this.s3.send(command);
    this.logger.log(`Uploaded: ${key} (${body.length} bytes)`);

    return { key, size: body.length };
  }

  /**
   * Generate a presigned URL for secure, time-limited access
   * DRM: Raw URLs are NEVER exposed to the client
   */
  async getPresignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: expiresInSeconds });
    return url;
  }

  /**
   * Delete a file from R2
   */
  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.s3.send(command);
    this.logger.log(`Deleted: ${key}`);
  }

  /**
   * Build the R2 object key for a resource
   */
  buildKey(
    version: string,
    grade: string,
    subject: string,
    term: number,
    week: number,
    resourceType: string,
    extension: string,
  ): string {
    return `content/${version}/${grade}/${subject}/term-${term}/week-${week}/${resourceType}.${extension}`;
  }
}
