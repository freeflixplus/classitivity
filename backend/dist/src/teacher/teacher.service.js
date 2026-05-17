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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
let TeacherService = class TeacherService {
    prisma;
    storage;
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
    }
    async getDashboard(schoolId) {
        const subscriptions = await this.prisma.subscription.findMany({
            where: { schoolId, status: { in: ['ACTIVE', 'TRIAL'] } },
            select: { gradeLevel: true, status: true, trialEndsAt: true, currentPeriodEnd: true },
        });
        const assignedGrades = subscriptions.map(s => s.gradeLevel);
        const recentActivity = await this.prisma.accessLog.findMany({
            where: { schoolId },
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: { action: true, createdAt: true },
        });
        return {
            assignedGrades,
            subscriptions,
            recentActivity: recentActivity.map(a => ({
                action: a.action,
                time: a.createdAt,
            })),
        };
    }
    async getClassesOverview(schoolId, curriculumVersion) {
        const subscriptions = await this.prisma.subscription.findMany({
            where: { schoolId, status: { in: ['ACTIVE', 'TRIAL'] } },
            select: { gradeLevel: true },
        });
        const assignedGrades = subscriptions.map(s => s.gradeLevel);
        const subjects = await this.prisma.subject.findMany({
            where: { curriculumVersion },
            select: { code: true, name: true },
        });
        return {
            assignedGrades,
            subjects,
        };
    }
    async getLessons(schoolId, curriculumVersion, gradeLevel, subjectCode) {
        const sub = await this.prisma.subscription.findFirst({
            where: {
                schoolId,
                gradeLevel,
                status: { in: ['ACTIVE', 'TRIAL'] },
            },
        });
        if (!sub) {
            throw new common_1.NotFoundException(`No active subscription for grade ${gradeLevel}`);
        }
        const subject = await this.prisma.subject.findUnique({
            where: { code_curriculumVersion: { code: subjectCode, curriculumVersion } },
        });
        if (!subject) {
            throw new common_1.NotFoundException(`Subject not found`);
        }
        const lessons = await this.prisma.lesson.findMany({
            where: {
                subjectId: subject.id,
                gradeLevel,
                status: 'PUBLISHED',
            },
            include: {
                resources: {
                    select: {
                        id: true,
                        type: true,
                        fileName: true,
                        fileSize: true,
                        mimeType: true,
                    },
                },
            },
            orderBy: [
                { term: 'asc' },
                { week: 'asc' },
            ],
        });
        return {
            subject: { code: subject.code, name: subject.name },
            lessons: lessons.map(lesson => ({
                id: lesson.id,
                term: lesson.term,
                week: lesson.week,
                title: lesson.title,
                resources: lesson.resources.map(res => ({
                    id: res.id,
                    type: res.type,
                    title: res.fileName.replace(/\.[^/.]+$/, ''),
                    fileSize: res.fileSize,
                    mimeType: res.mimeType,
                })),
            })),
        };
    }
    async getResourceUrl(resourceId, schoolId) {
        const resource = await this.prisma.resource.findUnique({
            where: { id: resourceId },
            include: {
                lesson: {
                    include: { subject: true },
                },
            },
        });
        if (!resource) {
            throw new common_1.NotFoundException('Resource not found');
        }
        const sub = await this.prisma.subscription.findFirst({
            where: {
                schoolId,
                gradeLevel: resource.lesson.gradeLevel,
                status: { in: ['ACTIVE', 'TRIAL'] },
            },
        });
        if (!sub) {
            throw new common_1.NotFoundException('No active subscription for this content');
        }
        const isDownloadable = ['STUDENT_NOTES', 'OBJECTIVE_QUESTIONS', 'THEORY_QUESTIONS'].includes(resource.type);
        const isViewOnly = ['LESSON_PLAN', 'POWERPOINT', 'LESSON_OBJECTIVES'].includes(resource.type);
        const url = await this.storage.getPresignedUrl(resource.r2Key, 900);
        return {
            url,
            type: resource.type,
            fileName: resource.fileName,
            isDownloadable,
            isViewOnly,
        };
    }
};
exports.TeacherService = TeacherService;
exports.TeacherService = TeacherService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], TeacherService);
//# sourceMappingURL=teacher.service.js.map