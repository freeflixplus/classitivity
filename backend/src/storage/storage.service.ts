import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService {
  private readonly supabase: SupabaseClient;
  private readonly bucket: string;
  private readonly logger = new Logger(StorageService.name);

  constructor(private config: ConfigService) {
    this.bucket = config.get('SUPABASE_STORAGE_BUCKET', 'content');

    const supabaseUrl = config.get('SUPABASE_URL', '');
    const supabaseServiceKey = config.get('SUPABASE_SERVICE_ROLE_KEY') || config.get('SUPABASE_SERVICE_KEY', '');

    if (!supabaseUrl || !supabaseServiceKey) {
      this.logger.warn('Supabase Storage credentials not configured — file operations will fail');
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });
  }

  /**
   * Ensure the storage bucket exists (called on first upload)
   */
  private async ensureBucket() {
    const { data } = await this.supabase.storage.getBucket(this.bucket);
    if (!data) {
      const { error } = await this.supabase.storage.createBucket(this.bucket, {
        public: false,
        fileSizeLimit: 52428800, // 50MB
      });
      if (error) {
        this.logger.error(`Failed to create bucket "${this.bucket}": ${error.message}`);
      } else {
        this.logger.log(`Created storage bucket: ${this.bucket}`);
      }
    }
  }

  /**
   * Upload a file to Supabase Storage
   * Key format: content/{version}/{grade}/{subject}/term-{N}/week-{N}/{type}.{ext}
   */
  async uploadFile(
    key: string,
    body: Buffer,
    mimeType: string,
  ): Promise<{ key: string; size: number }> {
    await this.ensureBucket();

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(key, body, {
        contentType: mimeType,
        upsert: true, // overwrite if exists
      });

    if (error) {
      this.logger.error(`Upload failed for ${key}: ${error.message}`);
      throw new Error(`Upload failed: ${error.message}`);
    }

    this.logger.log(`Uploaded: ${key} (${body.length} bytes)`);
    return { key, size: body.length };
  }

  /**
   * Generate a signed URL for secure, time-limited access
   */
  async getPresignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(this.bucket)
      .createSignedUrl(key, expiresInSeconds);

    if (error || !data?.signedUrl) {
      this.logger.error(`Failed to create signed URL for ${key}: ${error?.message}`);
      throw new Error(`Cannot generate download URL: ${error?.message || 'Unknown error'}`);
    }

    return data.signedUrl;
  }

  /**
   * Delete a file from Supabase Storage
   */
  async deleteFile(key: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(this.bucket)
      .remove([key]);

    if (error) {
      this.logger.error(`Delete failed for ${key}: ${error.message}`);
    } else {
      this.logger.log(`Deleted: ${key}`);
    }
  }

  /**
   * Build the storage object key for a resource
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

  /**
   * Download a file into a Buffer
   */
  async downloadFile(key: string): Promise<Buffer> {
    const { data, error } = await this.supabase.storage
      .from(this.bucket)
      .download(key);

    if (error || !data) {
      throw new Error(`Failed to download file: ${error?.message}`);
    }

    const arrayBuffer = await data.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}
