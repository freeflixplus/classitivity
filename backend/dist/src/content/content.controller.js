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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const content_service_1 = require("./content.service");
const content_dto_1 = require("./dto/content.dto");
let ContentController = class ContentController {
    contentService;
    constructor(contentService) {
        this.contentService = contentService;
    }
    async uploadResource(lessonId, file, resourceType, price, currency) {
        if (!file)
            throw new common_1.BadRequestException('File is required');
        const parsedPrice = price ? parseInt(price) : 0;
        return this.contentService.uploadResource(lessonId, file, resourceType, parsedPrice, currency || 'NGN');
    }
    async createLesson(dto) {
        return this.contentService.createLesson(dto);
    }
    async getLessons(version, grade, subject, term, status, page, limit) {
        return this.contentService.getLessons({
            version,
            grade,
            subject,
            term: term ? parseInt(term) : undefined,
            status,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
        });
    }
    async getLesson(id) {
        return this.contentService.getLesson(id);
    }
    async updateLessonStatus(id, dto) {
        return this.contentService.updateLessonStatus(id, dto.status);
    }
    async deleteResource(id) {
        return this.contentService.deleteResource(id);
    }
    async getContentTree(version) {
        return this.contentService.getContentTree(version);
    }
    async createSchemeOfWork(dto) {
        return this.contentService.createSchemeOfWork(dto);
    }
};
exports.ContentController = ContentController;
__decorate([
    (0, common_1.Post)('lessons/:lessonId/resources'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: { fileSize: 50 * 1024 * 1024 },
        fileFilter: (_req, file, cb) => {
            const allowed = [
                'application/pdf',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'application/vnd.ms-powerpoint',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ];
            if (allowed.includes(file.mimetype) || file.originalname.match(/\.(pdf|docx?|pptx?)$/i)) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException(`File type not supported: ${file.mimetype}. Allowed: PDF, DOC, DOCX, PPT, PPTX`), false);
            }
        },
    })),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('resourceType')),
    __param(3, (0, common_1.Body)('price')),
    __param(4, (0, common_1.Body)('currency')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String, String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "uploadResource", null);
__decorate([
    (0, common_1.Post)('lessons'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [content_dto_1.CreateLessonDto]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "createLesson", null);
__decorate([
    (0, common_1.Get)('lessons'),
    __param(0, (0, common_1.Query)('version')),
    __param(1, (0, common_1.Query)('grade')),
    __param(2, (0, common_1.Query)('subject')),
    __param(3, (0, common_1.Query)('term')),
    __param(4, (0, common_1.Query)('status')),
    __param(5, (0, common_1.Query)('page')),
    __param(6, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getLessons", null);
__decorate([
    (0, common_1.Get)('lessons/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getLesson", null);
__decorate([
    (0, common_1.Patch)('lessons/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, content_dto_1.UpdateLessonStatusDto]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "updateLessonStatus", null);
__decorate([
    (0, common_1.Delete)('resources/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "deleteResource", null);
__decorate([
    (0, common_1.Get)('content-tree/:version'),
    __param(0, (0, common_1.Param)('version')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getContentTree", null);
__decorate([
    (0, common_1.Post)('scheme-of-work'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "createSchemeOfWork", null);
exports.ContentController = ContentController = __decorate([
    (0, common_1.Controller)('admin/content'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('PLATFORM_ADMIN'),
    __metadata("design:paramtypes", [content_service_1.ContentService])
], ContentController);
//# sourceMappingURL=content.controller.js.map