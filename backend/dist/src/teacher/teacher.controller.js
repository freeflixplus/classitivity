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
exports.TeacherController = void 0;
const common_1 = require("@nestjs/common");
const teacher_service_1 = require("./teacher.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const school_status_guard_1 = require("../auth/guards/school-status.guard");
const subscription_access_guard_1 = require("../auth/guards/subscription-access.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let TeacherController = class TeacherController {
    teacherService;
    constructor(teacherService) {
        this.teacherService = teacherService;
    }
    getDashboard(req) {
        return this.teacherService.getDashboard(req.user.schoolId);
    }
    getClasses(req) {
        return this.teacherService.getClassesOverview(req.user.schoolId, req.user.curriculumVersion);
    }
    getLessons(req, grade, subject) {
        return this.teacherService.getLessons(req.user.schoolId, req.user.curriculumVersion, grade.toUpperCase(), subject.toUpperCase());
    }
    getResourceUrl(req, id) {
        return this.teacherService.getResourceUrl(id, req.user.schoolId);
    }
};
exports.TeacherController = TeacherController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('classes'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "getClasses", null);
__decorate([
    (0, common_1.UseGuards)(subscription_access_guard_1.SubscriptionAccessGuard),
    (0, common_1.Get)('classes/:grade/:subject'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('grade')),
    __param(2, (0, common_1.Param)('subject')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "getLessons", null);
__decorate([
    (0, common_1.Get)('resources/:id/url'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "getResourceUrl", null);
exports.TeacherController = TeacherController = __decorate([
    (0, common_1.Controller)('teachers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, school_status_guard_1.SchoolStatusGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.TEACHER, client_1.UserRole.SCHOOL_ADMIN),
    __metadata("design:paramtypes", [teacher_service_1.TeacherService])
], TeacherController);
//# sourceMappingURL=teacher.controller.js.map