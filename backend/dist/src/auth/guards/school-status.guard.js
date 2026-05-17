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
exports.SchoolStatusGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SchoolStatusGuard = class SchoolStatusGuard {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user?.schoolId || user.role === 'PLATFORM_ADMIN') {
            return true;
        }
        const school = await this.prisma.school.findUnique({
            where: { id: user.schoolId },
            select: { isActive: true },
        });
        if (!school) {
            throw new common_1.ForbiddenException('School not found');
        }
        if (!school.isActive) {
            throw new common_1.ForbiddenException('Your school account has been suspended. Please contact support.');
        }
        const activeSubs = await this.prisma.subscription.findFirst({
            where: {
                schoolId: user.schoolId,
                OR: [
                    { status: 'ACTIVE' },
                    {
                        status: 'TRIAL',
                        trialEndsAt: { gte: new Date() },
                    },
                ],
            },
        });
        if (!activeSubs) {
            throw new common_1.ForbiddenException('Your school subscription has expired. Please renew to continue accessing resources.');
        }
        return true;
    }
};
exports.SchoolStatusGuard = SchoolStatusGuard;
exports.SchoolStatusGuard = SchoolStatusGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SchoolStatusGuard);
//# sourceMappingURL=school-status.guard.js.map