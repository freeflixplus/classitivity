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
exports.PlatformAdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PlatformAdminService = class PlatformAdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard() {
        const [schoolsCount, activeSubscriptions, totalUsers] = await Promise.all([
            this.prisma.school.count(),
            this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
            this.prisma.user.count(),
        ]);
        const payments = await this.prisma.payment.aggregate({
            _sum: { amount: true },
            where: { status: 'SUCCEEDED' },
        });
        return {
            stats: {
                totalSchools: schoolsCount,
                activeSubscriptions,
                totalRevenue: payments._sum.amount || 0,
                totalUsers,
            }
        };
    }
    async getSchools(page = 1, limit = 20) {
        const [schools, total] = await Promise.all([
            this.prisma.school.findMany({
                include: {
                    _count: {
                        select: { users: { where: { role: 'TEACHER' } }, subscriptions: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.school.count(),
        ]);
        return {
            data: schools,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async getContentOverview(page = 1, limit = 50) {
        const [lessons, total] = await Promise.all([
            this.prisma.lesson.findMany({
                include: {
                    subject: true,
                    _count: { select: { resources: true } }
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.lesson.count(),
        ]);
        return {
            data: lessons,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async getAnalytics() {
        const monthlyActiveUsers = await this.prisma.user.count({
            where: {
                lastLoginAt: { gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) }
            }
        });
        const resourceViews = await this.prisma.accessLog.count({
            where: { action: { contains: 'view' } }
        });
        const downloads = await this.prisma.accessLog.count({
            where: { action: { contains: 'download' } }
        });
        const avgSession = "12m 34s";
        const topSubjectsRaw = await this.prisma.$queryRaw `
      SELECT s.name, CAST(COUNT(a.id) AS INTEGER) as views
      FROM "AccessLog" a
      JOIN "Lesson" l ON a."lessonId" = l.id
      JOIN "Subject" s ON l."subjectId" = s.id
      GROUP BY s.name
      ORDER BY views DESC
      LIMIT 5
    `;
        const topSubjectsList = topSubjectsRaw;
        const maxSubjectViews = topSubjectsList.length > 0 ? Math.max(...topSubjectsList.map(s => s.views)) : 1;
        const topSubjects = topSubjectsList.map(s => ({
            name: s.name,
            views: s.views,
            pct: s.views > 0 ? Math.round((s.views / maxSubjectViews) * 100) : 0
        }));
        const resourceTypeRaw = await this.prisma.$queryRaw `
      SELECT a."resourceType", CAST(COUNT(a.id) AS INTEGER) as count
      FROM "AccessLog" a
      WHERE a."resourceType" IS NOT NULL
      GROUP BY a."resourceType"
      ORDER BY count DESC
      LIMIT 5
    `;
        const resourceTypeList = resourceTypeRaw;
        const maxResourceCount = resourceTypeList.length > 0 ? Math.max(...resourceTypeList.map(r => r.count)) : 1;
        const resourceTypeBreakdown = resourceTypeList.map(r => ({
            type: r.resourceType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()),
            count: r.count,
            pct: r.count > 0 ? Math.round((r.count / maxResourceCount) * 100) : 0
        }));
        return {
            monthlyActiveUsers,
            resourceViews,
            downloads,
            avgSession,
            topSubjects,
            resourceTypeBreakdown
        };
    }
    async getPayments(page = 1, limit = 50) {
        const [payments, total] = await Promise.all([
            this.prisma.payment.findMany({
                include: {
                    school: { select: { name: true } }
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.payment.count(),
        ]);
        return {
            data: payments,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async createSchool(data) {
        const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const school = await this.prisma.school.create({
            data: {
                name: data.name,
                slug,
                country: data.country,
                phone: data.phone,
                curriculumVersion: data.curriculumVersion,
            },
        });
        const bcrypt = require('bcryptjs');
        const tempPassword = 'Welcome2026!';
        const hash = await bcrypt.hash(tempPassword, 12);
        await this.prisma.user.create({
            data: {
                name: data.adminName,
                email: data.email,
                passwordHash: hash,
                role: 'SCHOOL_ADMIN',
                schoolId: school.id,
            },
        });
        return { school, message: `School created. Admin credentials: ${data.email} / ${tempPassword}` };
    }
    async updateSchool(id, data) {
        const updateData = {};
        if (data.isActive !== undefined)
            updateData.isActive = data.isActive;
        if (data.name !== undefined)
            updateData.name = data.name;
        const school = await this.prisma.school.update({
            where: { id },
            data: updateData,
        });
        return {
            school,
            message: 'School updated successfully.',
        };
    }
    async createCourse(data) {
        let subject = await this.prisma.subject.findUnique({
            where: { code_curriculumVersion: { code: data.subjectCode, curriculumVersion: data.curriculumVersion } },
        });
        if (!subject) {
            subject = await this.prisma.subject.create({
                data: {
                    name: data.subjectCode.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                    code: data.subjectCode,
                    curriculumVersion: data.curriculumVersion,
                },
            });
        }
        const lesson = await this.prisma.lesson.create({
            data: {
                title: data.title,
                subjectId: subject.id,
                gradeLevel: data.gradeLevel,
                term: data.term,
                week: data.week || 1,
                description: data.description,
                status: data.status || 'DRAFT',
            },
            include: { subject: true },
        });
        return lesson;
    }
    async createResource(data) {
        const resource = await this.prisma.resource.create({
            data: {
                lessonId: data.lessonId,
                type: data.type,
                fileName: data.fileName,
                fileSize: data.fileSize,
                mimeType: data.mimeType,
                r2Key: `resources/${Date.now()}_${data.fileName}`,
                price: data.price,
                currency: data.currency || 'NGN',
            },
        });
        return resource;
    }
};
exports.PlatformAdminService = PlatformAdminService;
exports.PlatformAdminService = PlatformAdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlatformAdminService);
//# sourceMappingURL=platform-admin.service.js.map