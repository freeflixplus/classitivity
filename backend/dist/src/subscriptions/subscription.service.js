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
var SubscriptionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const schedule_1 = require("@nestjs/schedule");
let SubscriptionService = SubscriptionService_1 = class SubscriptionService {
    prisma;
    logger = new common_1.Logger(SubscriptionService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handlePaymentSuccess(data) {
        const start = new Date();
        const end = new Date();
        if (data.billingCycle === 'MONTHLY')
            end.setMonth(end.getMonth() + 1);
        else if (data.billingCycle === 'TERMLY')
            end.setMonth(end.getMonth() + 4);
        else if (data.billingCycle === 'ANNUALLY')
            end.setFullYear(end.getFullYear() + 1);
        const subscription = await this.prisma.subscription.upsert({
            where: {
                schoolId_gradeLevel: { schoolId: data.schoolId, gradeLevel: data.gradeLevel },
            },
            update: {
                status: 'ACTIVE',
                billingCycle: data.billingCycle,
                currentPeriodStart: start,
                currentPeriodEnd: end,
                gateway: data.gateway,
                gatewayCustomerId: data.customerId,
                gatewaySubscriptionId: data.subscriptionId,
            },
            create: {
                schoolId: data.schoolId,
                gradeLevel: data.gradeLevel,
                billingCycle: data.billingCycle,
                status: 'ACTIVE',
                currentPeriodStart: start,
                currentPeriodEnd: end,
                gateway: data.gateway,
                gatewayCustomerId: data.customerId,
                gatewaySubscriptionId: data.subscriptionId,
            },
        });
        await this.prisma.payment.create({
            data: {
                schoolId: data.schoolId,
                subscriptionId: subscription.id,
                amount: data.amount,
                currency: data.currency,
                gateway: data.gateway,
                gatewayRef: data.gatewayRef,
                status: 'SUCCEEDED',
                paidAt: new Date(),
            },
        });
        this.logger.log(`Activated subscription for school ${data.schoolId}, grade ${data.gradeLevel}`);
    }
    async checkExpiredSubscriptions() {
        this.logger.log('Running daily subscription expiry check...');
        const now = new Date();
        const expired = await this.prisma.subscription.findMany({
            where: {
                status: 'ACTIVE',
                currentPeriodEnd: { lt: now },
            },
        });
        for (const sub of expired) {
            await this.prisma.subscription.update({
                where: { id: sub.id },
                data: { status: 'PAST_DUE' },
            });
            this.logger.log(`Subscription ${sub.id} marked as PAST_DUE`);
        }
    }
};
exports.SubscriptionService = SubscriptionService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionService.prototype, "checkExpiredSubscriptions", null);
exports.SubscriptionService = SubscriptionService = SubscriptionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionService);
//# sourceMappingURL=subscription.service.js.map