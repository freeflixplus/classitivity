"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchoolAdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
const client_1 = require("@prisma/client");
let SchoolAdminService = class SchoolAdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard(schoolId) {
        const [subscriptionsCount, teachersCount, accessLogs] = await Promise.all([
            this.prisma.subscription.count({ where: { schoolId, status: 'ACTIVE' } }),
            this.prisma.user.count({ where: { schoolId, role: 'TEACHER' } }),
            this.prisma.accessLog.findMany({
                where: { schoolId },
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: { user: { select: { name: true } } }
            })
        ]);
        const activeSubscriptions = await this.prisma.subscription.findMany({
            where: { schoolId, status: 'ACTIVE' },
            select: { gradeLevel: true, status: true }
        });
        return {
            stats: {
                activeSubscriptions: subscriptionsCount,
                totalTeachers: teachersCount,
                resourcesAccessed: 0,
                nextRenewal: 'Jun 15'
            },
            activeSubscriptions,
            recentActivity: accessLogs.map(log => ({
                name: log.user.name,
                action: log.action,
                time: log.createdAt
            }))
        };
    }
    async getTeachers(schoolId) {
        return this.prisma.user.findMany({
            where: { schoolId, role: 'TEACHER' },
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true,
                lastLoginAt: true,
            }
        });
    }
    async addTeacher(schoolId, data) {
        const crypto = await import('crypto');
        const tempPassword = crypto.randomBytes(8).toString('base64url').slice(0, 12);
        const passwordHash = await bcrypt.hash(tempPassword, 12);
        const teacher = await this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash,
                role: client_1.UserRole.TEACHER,
                schoolId,
            },
            select: { id: true, name: true, email: true }
        });
        return { ...teacher, temporaryPassword: tempPassword };
    }
    async getSubscriptions(schoolId) {
        return this.prisma.subscription.findMany({
            where: { schoolId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getBillingHistory(schoolId) {
        return this.prisma.payment.findMany({
            where: { schoolId },
            orderBy: { createdAt: 'desc' },
            include: {
                subscription: { select: { gradeLevel: true, billingCycle: true } }
            }
        });
    }
};
exports.SchoolAdminService = SchoolAdminService;
exports.SchoolAdminService = SchoolAdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SchoolAdminService);
//# sourceMappingURL=school-admin.service.js.map