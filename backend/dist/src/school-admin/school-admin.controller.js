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
exports.SchoolAdminController = void 0;
const common_1 = require("@nestjs/common");
const school_admin_service_1 = require("./school-admin.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const school_status_guard_1 = require("../auth/guards/school-status.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let SchoolAdminController = class SchoolAdminController {
    schoolAdminService;
    constructor(schoolAdminService) {
        this.schoolAdminService = schoolAdminService;
    }
    getDashboard(req) {
        return this.schoolAdminService.getDashboard(req.user.schoolId);
    }
    getTeachers(req) {
        return this.schoolAdminService.getTeachers(req.user.schoolId);
    }
    addTeacher(req, data) {
        return this.schoolAdminService.addTeacher(req.user.schoolId, data);
    }
    getSubscriptions(req) {
        return this.schoolAdminService.getSubscriptions(req.user.schoolId);
    }
    getBillingHistory(req) {
        return this.schoolAdminService.getBillingHistory(req.user.schoolId);
    }
};
exports.SchoolAdminController = SchoolAdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SchoolAdminController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('teachers'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SchoolAdminController.prototype, "getTeachers", null);
__decorate([
    (0, common_1.Post)('teachers'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SchoolAdminController.prototype, "addTeacher", null);
__decorate([
    (0, common_1.Get)('subscriptions'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SchoolAdminController.prototype, "getSubscriptions", null);
__decorate([
    (0, common_1.Get)('billing'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SchoolAdminController.prototype, "getBillingHistory", null);
exports.SchoolAdminController = SchoolAdminController = __decorate([
    (0, common_1.Controller)('school-admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, school_status_guard_1.SchoolStatusGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SCHOOL_ADMIN),
    __metadata("design:paramtypes", [school_admin_service_1.SchoolAdminService])
], SchoolAdminController);
//# sourceMappingURL=school-admin.controller.js.map