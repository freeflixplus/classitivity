"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
let StorageService = StorageService_1 = class StorageService {
    config;
    supabase;
    bucket;
    logger = new common_1.Logger(StorageService_1.name);
    constructor(config) {
        this.config = config;
        this.bucket = config.get('SUPABASE_STORAGE_BUCKET', 'content');
        const supabaseUrl = config.get('SUPABASE_URL', '');
        const supabaseServiceKey = config.get('SUPABASE_SERVICE_KEY', '');
        if (!supabaseUrl || !supabaseServiceKey) {
            this.logger.warn('Supabase Storage credentials not configured — file operations will fail');
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey, {
            auth: { persistSession: false },
        });
    }
    async ensureBucket() {
        const { data } = await this.supabase.storage.getBucket(this.bucket);
        if (!data) {
            const { error } = await this.supabase.storage.createBucket(this.bucket, {
                public: false,
                fileSizeLimit: 52428800,
            });
            if (error) {
                this.logger.error(`Failed to create bucket "${this.bucket}": ${error.message}`);
            }
            else {
                this.logger.log(`Created storage bucket: ${this.bucket}`);
            }
        }
    }
    async uploadFile(key, body, mimeType) {
        await this.ensureBucket();
        const { error } = await this.supabase.storage
            .from(this.bucket)
            .upload(key, body, {
            contentType: mimeType,
            upsert: true,
        });
        if (error) {
            this.logger.error(`Upload failed for ${key}: ${error.message}`);
            throw new Error(`Upload failed: ${error.message}`);
        }
        this.logger.log(`Uploaded: ${key} (${body.length} bytes)`);
        return { key, size: body.length };
    }
    async getPresignedUrl(key, expiresInSeconds = 3600) {
        const { data, error } = await this.supabase.storage
            .from(this.bucket)
            .createSignedUrl(key, expiresInSeconds);
        if (error || !data?.signedUrl) {
            this.logger.error(`Failed to create signed URL for ${key}: ${error?.message}`);
            throw new Error(`Cannot generate download URL: ${error?.message || 'Unknown error'}`);
        }
        return data.signedUrl;
    }
    async deleteFile(key) {
        const { error } = await this.supabase.storage
            .from(this.bucket)
            .remove([key]);
        if (error) {
            this.logger.error(`Delete failed for ${key}: ${error.message}`);
        }
        else {
            this.logger.log(`Deleted: ${key}`);
        }
    }
    buildKey(version, grade, subject, term, week, resourceType, extension) {
        return `content/${version}/${grade}/${subject}/term-${term}/week-${week}/${resourceType}.${extension}`;
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
//# sourceMappingURL=storage.service.js.map