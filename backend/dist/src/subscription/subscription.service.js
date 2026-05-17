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
const client_1 = require("@prisma/client");
let SubscriptionService = SubscriptionService_1 = class SubscriptionService {
    prisma;
    logger = new common_1.Logger(SubscriptionService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSchoolSubscriptions(schoolId) {
        return this.prisma.subscription.findMany({
            where: { schoolId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createSubscription(schoolId, gradeLevel, billingCycle) {
        const existing = await this.prisma.subscription.findUnique({
            where: { schoolId_gradeLevel: { schoolId, gradeLevel: gradeLevel.toUpperCase() } },
        });
        if (existing && (existing.status === 'ACTIVE' || existing.status === 'TRIAL')) {
            throw new common_1.ConflictException(`An active subscription already exists for ${gradeLevel}`);
        }
        const trialEndsAt = new Date();
        trialEndsAt.setDate(trialEndsAt.getDate() + 3);
        const subscription = await this.prisma.subscription.create({
            data: {
                schoolId,
                gradeLevel: gradeLevel.toUpperCase(),
                billingCycle,
                status: client_1.SubscriptionStatus.TRIAL,
                trialEndsAt,
                currentPeriodStart: new Date(),
                currentPeriodEnd: trialEndsAt,
            },
        });
        this.logger.log(`Trial subscription created: school=${schoolId}, grade=${gradeLevel}`);
        return subscription;
    }
    async activateSubscription(subscriptionId, gatewayCustomerId, gatewaySubscriptionId) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { id: subscriptionId },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        const periodEnd = this.calculatePeriodEnd(subscription.billingCycle);
        return this.prisma.subscription.update({
            where: { id: subscriptionId },
            data: {
                status: client_1.SubscriptionStatus.ACTIVE,
                gatewayCustomerId,
                gatewaySubscriptionId,
                currentPeriodStart: new Date(),
                currentPeriodEnd: periodEnd,
                trialEndsAt: null,
            },
        });
    }
    async cancelSubscription(schoolId, subscriptionId) {
        const subscription = await this.prisma.subscription.findFirst({
            where: { id: subscriptionId, schoolId },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        if (subscription.status === 'CANCELLED' || subscription.status === 'EXPIRED') {
            throw new common_1.BadRequestException('Subscription is already cancelled or expired');
        }
        return this.prisma.subscription.update({
            where: { id: subscriptionId },
            data: { status: client_1.SubscriptionStatus.CANCELLED },
        });
    }
    async expireOverdueSubscriptions() {
        const now = new Date();
        const expired = await this.prisma.subscription.updateMany({
            where: {
                status: 'ACTIVE',
                currentPeriodEnd: { lt: now },
            },
            data: { status: client_1.SubscriptionStatus.EXPIRED },
        });
        const expiredTrials = await this.prisma.subscription.updateMany({
            where: {
                status: 'TRIAL',
                trialEndsAt: { lt: now },
            },
            data: { status: client_1.SubscriptionStatus.EXPIRED },
        });
        this.logger.log(`Expired ${expired.count} subscriptions and ${expiredTrials.count} trials`);
        return { expiredSubscriptions: expired.count, expiredTrials: expiredTrials.count };
    }
    calculatePeriodEnd(billingCycle) {
        const now = new Date();
        switch (billingCycle) {
            case 'MONTHLY':
                return new Date(now.setMonth(now.getMonth() + 1));
            case 'TERMLY':
                return new Date(now.setMonth(now.getMonth() + 4));
            case 'ANNUALLY':
                return new Date(now.setFullYear(now.getFullYear() + 1));
            default:
                return new Date(now.setMonth(now.getMonth() + 1));
        }
    }
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = SubscriptionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionService);
//# sourceMappingURL=subscription.service.js.map