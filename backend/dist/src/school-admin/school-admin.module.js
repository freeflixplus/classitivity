"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchoolAdminModule = void 0;
const common_1 = require("@nestjs/common");
const school_admin_controller_1 = require("./school-admin.controller");
const school_admin_service_1 = require("./school-admin.service");
const prisma_module_1 = require("../prisma/prisma.module");
let SchoolAdminModule = class SchoolAdminModule {
};
exports.SchoolAdminModule = SchoolAdminModule;
exports.SchoolAdminModule = SchoolAdminModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [school_admin_controller_1.SchoolAdminController],
        providers: [school_admin_service_1.SchoolAdminService],
        exports: [school_admin_service_1.SchoolAdminService],
    })
], SchoolAdminModule);
//# sourceMappingURL=school-admin.module.js.map