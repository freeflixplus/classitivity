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
exports.PlatformAdminController = void 0;
const common_1 = require("@nestjs/common");
const platform_admin_service_1 = require("./platform-admin.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let PlatformAdminController = class PlatformAdminController {
    platformAdminService;
    constructor(platformAdminService) {
        this.platformAdminService = platformAdminService;
    }
    getDashboard() {
        return this.platformAdminService.getDashboard();
    }
    getSchools(page = 1, limit = 20) {
        return this.platformAdminService.getSchools(+page, +limit);
    }
    createSchool(data) {
        return this.platformAdminService.createSchool(data);
    }
    updateSchool(id, data) {
        return this.platformAdminService.updateSchool(id, data);
    }
    getContentOverview(page = 1, limit = 50) {
        return this.platformAdminService.getContentOverview(+page, +limit);
    }
    createCourse(data) {
        return this.platformAdminService.createCourse(data);
    }
    createResource(data) {
        return this.platformAdminService.createResource(data);
    }
    getAnalytics() {
        return this.platformAdminService.getAnalytics();
    }
    getPayments(page = 1, limit = 50) {
        return this.platformAdminService.getPayments(+page, +limit);
    }
};
exports.PlatformAdminController = PlatformAdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformAdminController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('schools'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PlatformAdminController.prototype, "getSchools", null);
__decorate([
    (0, common_1.Post)('schools'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PlatformAdminController.prototype, "createSchool", null);
__decorate([
    (0, common_1.Patch)('schools/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PlatformAdminController.prototype, "updateSchool", null);
__decorate([
    (0, common_1.Get)('content'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PlatformAdminController.prototype, "getContentOverview", null);
__decorate([
    (0, common_1.Post)('courses'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PlatformAdminController.prototype, "createCourse", null);
__decorate([
    (0, common_1.Post)('resources'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PlatformAdminController.prototype, "createResource", null);
__decorate([
    (0, common_1.Get)('analytics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformAdminController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)('payments'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PlatformAdminController.prototype, "getPayments", null);
exports.PlatformAdminController = PlatformAdminController = __decorate([
    (0, common_1.Controller)('platform-admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.PLATFORM_ADMIN),
    __metadata("design:paramtypes", [platform_admin_service_1.PlatformAdminService])
], PlatformAdminController);
//# sourceMappingURL=platform-admin.controller.js.map