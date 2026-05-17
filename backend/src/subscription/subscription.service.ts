import { Injectable, ConflictException, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BillingCycle, SubscriptionStatus } from '@prisma/client';

/**
 * Subscription Service
 * Architecture: Section 8 — Subscription & Payment Engine
 * Handles subscription lifecycle: trial → active → renewal → cancellation
 */
@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get all subscriptions for a school
   */
  async getSchoolSubscriptions(schoolId: string) {
    return this.prisma.subscription.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Create a new class-level subscription (or start trial)
   * Architecture: Class Selection → Billing Cycle → Payment
   */
  async createSubscription(schoolId: string, gradeLevel: string, billingCycle: BillingCycle) {
    // Check for existing subscription for this school+grade
    const existing = await this.prisma.subscription.findUnique({
      where: { schoolId_gradeLevel: { schoolId, gradeLevel: gradeLevel.toUpperCase() } },
    });

    if (existing && (existing.status === 'ACTIVE' || existing.status === 'TRIAL')) {
      throw new ConflictException(`An active subscription already exists for ${gradeLevel}`);
    }

    // Calculate trial end date (3 days from now)
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 3);

    const subscription = await this.prisma.subscription.create({
      data: {
        schoolId,
        gradeLevel: gradeLevel.toUpperCase(),
        billingCycle,
        status: SubscriptionStatus.TRIAL,
        trialEndsAt,
        currentPeriodStart: new Date(),
        currentPeriodEnd: trialEndsAt,
      },
    });

    this.logger.log(`Trial subscription created: school=${schoolId}, grade=${gradeLevel}`);

    return subscription;
  }

  /**
   * Activate a subscription after successful payment
   * Called by the webhook handler when payment succeeds
   */
  async activateSubscription(subscriptionId: string, gatewayCustomerId: string, gatewaySubscriptionId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    // Calculate period end based on billing cycle
    const periodEnd = this.calculatePeriodEnd(subscription.billingCycle);

    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: SubscriptionStatus.ACTIVE,
        gatewayCustomerId,
        gatewaySubscriptionId,
        currentPeriodStart: new Date(),
        currentPeriodEnd: periodEnd,
        trialEndsAt: null,
      },
    });
  }

  /**
   * Cancel a subscription — access continues until period end
   */
  async cancelSubscription(schoolId: string, subscriptionId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { id: subscriptionId, schoolId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.status === 'CANCELLED' || subscription.status === 'EXPIRED') {
      throw new BadRequestException('Subscription is already cancelled or expired');
    }

    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: SubscriptionStatus.CANCELLED },
    });
  }

  /**
   * Check and expire subscriptions past their period end
   * Architecture: Daily cron job via BullMQ
   */
  async expireOverdueSubscriptions() {
    const now = new Date();

    // Expire active subscriptions past their period end
    const expired = await this.prisma.subscription.updateMany({
      where: {
        status: 'ACTIVE',
        currentPeriodEnd: { lt: now },
      },
      data: { status: SubscriptionStatus.EXPIRED },
    });

    // Expire trials past their trial end
    const expiredTrials = await this.prisma.subscription.updateMany({
      where: {
        status: 'TRIAL',
        trialEndsAt: { lt: now },
      },
      data: { status: SubscriptionStatus.EXPIRED },
    });

    this.logger.log(`Expired ${expired.count} subscriptions and ${expiredTrials.count} trials`);

    return { expiredSubscriptions: expired.count, expiredTrials: expiredTrials.count };
  }

  private calculatePeriodEnd(billingCycle: BillingCycle): Date {
    const now = new Date();
    switch (billingCycle) {
      case 'MONTHLY':
        return new Date(now.setMonth(now.getMonth() + 1));
      case 'TERMLY':
        return new Date(now.setMonth(now.getMonth() + 4)); // ~1 term
      case 'ANNUALLY':
        return new Date(now.setFullYear(now.getFullYear() + 1));
      default:
        return new Date(now.setMonth(now.getMonth() + 1));
    }
  }
}
