import { ConfigService } from '@nestjs/config';
export declare class StorageService {
    private config;
    private readonly s3;
    private readonly bucket;
    private readonly logger;
    constructor(config: ConfigService);
    uploadFile(key: string, body: Buffer, mimeType: string): Promise<{
        key: string;
        size: number;
    }>;
    getPresignedUrl(key: string, expiresInSeconds?: number): Promise<string>;
    deleteFile(key: string): Promise<void>;
    buildKey(version: string, grade: string, subject: string, term: number, week: number, resourceType: string, extension: string): string;
}
