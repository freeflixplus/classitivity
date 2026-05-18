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
var ContentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
const client_1 = require("@prisma/client");
let ContentService = ContentService_1 = class ContentService {
    prisma;
    storage;
    logger = new common_1.Logger(ContentService_1.name);
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
    }
    async uploadResource(lessonId, file, resourceTypeStr, price = 0, currency = 'NGN') {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { subject: true },
        });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        const resourceType = resourceTypeStr.toUpperCase();
        if (!Object.values(client_1.ResourceType).includes(resourceType)) {
            throw new common_1.BadRequestException(`Invalid resource type: ${resourceTypeStr}`);
        }
        const existing = await this.prisma.resource.findUnique({
            where: { lessonId_type: { lessonId, type: resourceType } },
        });
        const ext = file.originalname.split('.').pop() || 'pdf';
        const r2Key = this.storage.buildKey(lesson.subject.curriculumVersion, lesson.gradeLevel, lesson.subject.code, lesson.term, lesson.week, resourceType.toLowerCase(), ext);
        await this.storage.uploadFile(r2Key, file.buffer, file.mimetype);
        if (existing) {
            await this.storage.deleteFile(existing.r2Key);
            const resource = await this.prisma.resource.update({
                where: { id: existing.id },
                data: {
                    fileName: file.originalname,
                    fileSize: file.size,
                    mimeType: file.mimetype,
                    r2Key,
                    price,
                    currency,
                },
            });
            this.logger.log(`Replaced resource: ${resourceType} for lesson ${lessonId}`);
            return resource;
        }
        else {
            const resource = await this.prisma.resource.create({
                data: {
                    lessonId,
                    type: resourceType,
                    fileName: file.originalname,
                    fileSize: file.size,
                    mimeType: file.mimetype,
                    r2Key,
                    price,
                    currency,
                },
            });
            this.logger.log(`Created resource: ${resourceType} for lesson ${lessonId}`);
            return resource;
        }
    }
    async createLesson(dto) {
        let subject = await this.prisma.subject.findUnique({
            where: { code_curriculumVersion: { code: dto.subjectCode, curriculumVersion: dto.curriculumVersion } },
        });
        if (!subject) {
            subject = await this.prisma.subject.create({
                data: {
                    name: dto.subjectName || dto.subjectCode,
                    code: dto.subjectCode,
                    curriculumVersion: dto.curriculumVersion,
                },
            });
        }
        return this.prisma.lesson.create({
            data: {
                subjectId: subject.id,
                gradeLevel: dto.gradeLevel,
                term: dto.term,
                week: dto.week,
                title: dto.title,
                description: dto.description,
            },
            include: { subject: true, resources: true },
        });
    }
    async getLessons(filters) {
        const where = {};
        if (filters.grade)
            where.gradeLevel = filters.grade;
        if (filters.term)
            where.term = filters.term;
        if (filters.status)
            where.status = filters.status.toUpperCase();
        if (filters.version || filters.subject) {
            where.subject = {};
            if (filters.version)
                where.subject.curriculumVersion = filters.version;
            if (filters.subject)
                where.subject.code = filters.subject;
        }
        const [lessons, total] = await Promise.all([
            this.prisma.lesson.findMany({
                where,
                include: {
                    subject: { select: { name: true, code: true, curriculumVersion: true } },
                    resources: { select: { id: true, type: true, fileName: true, fileSize: true } },
                },
                orderBy: [{ term: 'asc' }, { week: 'asc' }],
                skip: (filters.page - 1) * filters.limit,
                take: filters.limit,
            }),
            this.prisma.lesson.count({ where }),
        ]);
        return {
            data: lessons,
            pagination: {
                page: filters.page,
                limit: filters.limit,
                total,
                totalPages: Math.ceil(total / filters.limit),
            },
        };
    }
    async getLesson(id) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id },
            include: {
                subject: true,
                resources: true,
            },
        });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        return lesson;
    }
    async updateLessonStatus(id, status) {
        const lesson = await this.prisma.lesson.findUnique({ where: { id } });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        return this.prisma.lesson.update({
            where: { id },
            data: { status: status.toUpperCase() },
            include: { subject: true, resources: true },
        });
    }
    async deleteResource(id) {
        const resource = await this.prisma.resource.findUnique({ where: { id } });
        if (!resource)
            throw new common_1.NotFoundException('Resource not found');
        await this.storage.deleteFile(resource.r2Key);
        await this.prisma.resource.delete({ where: { id } });
        return { message: 'Resource deleted successfully' };
    }
    async getContentTree(version) {
        return this.prisma.class.findMany({
            where: { curriculumVersion: version.toUpperCase() },
            include: {
                subjects: {
                    include: {
                        terms: {
                            include: {
                                topics: {
                                    include: {
                                        lessons: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    async createSchemeOfWork(dto) {
        return this.prisma.schemeOfWork.create({
            data: {
                subjectId: dto.subjectId,
                topicId: dto.topicId,
                termId: dto.termId,
                weekNumber: dto.weekNumber,
                lessonCount: dto.lessonCount,
            }
        });
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = ContentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], ContentService);
//# sourceMappingURL=content.service.js.map