import { PrismaService } from '../prisma/prisma.service';
import { BillingCycle } from '@prisma/client';
export declare class SubscriptionService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getSchoolSubscriptions(schoolId: string): Promise<{
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        gradeLevel: string;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        billingCycle: import("@prisma/client").$Enums.BillingCycle;
        trialEndsAt: Date | null;
        currentPeriodStart: Date | null;
        currentPeriodEnd: Date | null;
        gatewayCustomerId: string | null;
        gatewaySubscriptionId: string | null;
        gateway: import("@prisma/client").$Enums.PaymentGateway | null;
    }[]>;
    createSubscription(schoolId: string, gradeLevel: string, billingCycle: BillingCycle): Promise<{
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        gradeLevel: string;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        billingCycle: import("@prisma/client").$Enums.BillingCycle;
        trialEndsAt: Date | null;
        currentPeriodStart: Date | null;
        currentPeriodEnd: Date | null;
        gatewayCustomerId: string | null;
        gatewaySubscriptionId: string | null;
        gateway: import("@prisma/client").$Enums.PaymentGateway | null;
    }>;
    activateSubscription(subscriptionId: string, gatewayCustomerId: string, gatewaySubscriptionId: string): Promise<{
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        gradeLevel: string;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        billingCycle: import("@prisma/client").$Enums.BillingCycle;
        trialEndsAt: Date | null;
        currentPeriodStart: Date | null;
        currentPeriodEnd: Date | null;
        gatewayCustomerId: string | null;
        gatewaySubscriptionId: string | null;
        gateway: import("@prisma/client").$Enums.PaymentGateway | null;
    }>;
    cancelSubscription(schoolId: string, subscriptionId: string): Promise<{
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        gradeLevel: string;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        billingCycle: import("@prisma/client").$Enums.BillingCycle;
        trialEndsAt: Date | null;
        currentPeriodStart: Date | null;
        currentPeriodEnd: Date | null;
        gatewayCustomerId: string | null;
        gatewaySubscriptionId: string | null;
        gateway: import("@prisma/client").$Enums.PaymentGateway | null;
    }>;
    expireOverdueSubscriptions(): Promise<{
        expiredSubscriptions: number;
        expiredTrials: number;
    }>;
    private calculatePeriodEnd;
}
