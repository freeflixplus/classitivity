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
exports.CurriculumController = void 0;
const common_1 = require("@nestjs/common");
const curriculum_config_1 = require("../config/curriculum.config");
const prisma_service_1 = require("../prisma/prisma.service");
let CurriculumController = class CurriculumController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getVersions() {
        return Object.values(curriculum_config_1.CURRICULUM_CONFIGS).map(c => ({
            code: c.code,
            label: c.label,
            currency: c.currency,
            termModel: c.termModel,
            examRefs: c.examRefs,
        }));
    }
    getGrades(version) {
        const config = (0, curriculum_config_1.getCurriculumConfig)(version || 'NG');
        if (!config)
            return { error: 'Invalid curriculum version' };
        return {
            version: config.code,
            gradeGroups: config.gradeGroups,
        };
    }
    async getSubjects(gradeCode, version) {
        const subjects = await this.prisma.subject.findMany({
            where: { curriculumVersion: (version || 'NG') },
            select: { id: true, code: true, name: true },
            orderBy: { name: 'asc' },
        });
        return {
            version: version || 'NG',
            gradeCode: gradeCode.toUpperCase(),
            subjects,
        };
    }
    async getTerms(subjectCode, version, grade) {
        const config = (0, curriculum_config_1.getCurriculumConfig)(version || 'NG');
        if (!config)
            return { error: 'Invalid curriculum version' };
        const lessons = await this.prisma.lesson.findMany({
            where: {
                subject: {
                    code: subjectCode.toUpperCase(),
                    curriculumVersion: (version || 'NG'),
                },
                gradeLevel: grade?.toUpperCase(),
                status: 'PUBLISHED',
            },
            select: { term: true },
            distinct: ['term'],
            orderBy: { term: 'asc' },
        });
        return {
            version: config.code,
            subjectCode: subjectCode.toUpperCase(),
            termModel: config.termModel,
            terms: lessons.map(l => ({
                number: l.term,
                label: config.termModel === 'semester' ? `Semester ${l.term}` : `Term ${l.term}`,
            })),
        };
    }
    async getLessons(termNumber, version, grade, subject) {
        const lessons = await this.prisma.lesson.findMany({
            where: {
                term: parseInt(termNumber),
                gradeLevel: grade?.toUpperCase(),
                status: 'PUBLISHED',
                subject: {
                    code: subject?.toUpperCase(),
                    curriculumVersion: (version || 'NG'),
                },
            },
            select: {
                id: true,
                title: true,
                week: true,
                term: true,
                description: true,
                resources: {
                    select: { id: true, type: true },
                },
            },
            orderBy: { week: 'asc' },
        });
        return {
            term: parseInt(termNumber),
            gradeLevel: grade?.toUpperCase(),
            subjectCode: subject?.toUpperCase(),
            lessons,
        };
    }
};
exports.CurriculumController = CurriculumController;
__decorate([
    (0, common_1.Get)('versions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CurriculumController.prototype, "getVersions", null);
__decorate([
    (0, common_1.Get)('grades'),
    __param(0, (0, common_1.Query)('version')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CurriculumController.prototype, "getGrades", null);
__decorate([
    (0, common_1.Get)('grades/:gradeCode/subjects'),
    __param(0, (0, common_1.Param)('gradeCode')),
    __param(1, (0, common_1.Query)('version')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CurriculumController.prototype, "getSubjects", null);
__decorate([
    (0, common_1.Get)('subjects/:subjectCode/terms'),
    __param(0, (0, common_1.Param)('subjectCode')),
    __param(1, (0, common_1.Query)('version')),
    __param(2, (0, common_1.Query)('grade')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CurriculumController.prototype, "getTerms", null);
__decorate([
    (0, common_1.Get)('terms/:termNumber/lessons'),
    __param(0, (0, common_1.Param)('termNumber')),
    __param(1, (0, common_1.Query)('version')),
    __param(2, (0, common_1.Query)('grade')),
    __param(3, (0, common_1.Query)('subject')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], CurriculumController.prototype, "getLessons", null);
exports.CurriculumController = CurriculumController = __decorate([
    (0, common_1.Controller)('curriculum'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CurriculumController);
//# sourceMappingURL=curriculum.controller.js.map