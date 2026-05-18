import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(private prisma: PrismaService) {}

  async handlePaymentSuccess(data: {
    schoolId: string;
    gradeLevel: string;
    billingCycle: 'MONTHLY' | 'TERMLY' | 'ANNUALLY';
    amount: number;
    currency: string;
    gateway: 'PAYSTACK' | 'STRIPE';
    gatewayRef: string;
    customerId?: string;
    subscriptionId?: string;
  }) {
    // Determine period
    const start = new Date();
    const end = new Date();
    if (data.billingCycle === 'MONTHLY') end.setMonth(end.getMonth() + 1);
    else if (data.billingCycle === 'TERMLY') end.setMonth(end.getMonth() + 4);
    else if (data.billingCycle === 'ANNUALLY') end.setFullYear(end.getFullYear() + 1);

    // Upsert subscription
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

    // Record payment
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
    // TODO: Send confirmation email
  }

  // Phase 2: Cron job for checking expired subscriptions
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkExpiredSubscriptions() {
    this.logger.log('Running daily subscription expiry check...');
    const now = new Date();
    
    // Find active subscriptions that have passed their end date
    const expired = await this.prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        currentPeriodEnd: { lt: now },
      },
    });

    for (const sub of expired) {
      // Set status to PAST_DUE or EXPIRED
      await this.prisma.subscription.update({
        where: { id: sub.id },
        data: { status: 'PAST_DUE' }, // Using PAST_DUE for 7-day grace period
      });
      this.logger.log(`Subscription ${sub.id} marked as PAST_DUE`);
      // TODO: Send renewal reminder email
    }
  }
}
