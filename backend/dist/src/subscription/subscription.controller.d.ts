import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/subscription.dto';
export declare class SubscriptionController {
    private readonly subscriptionService;
    constructor(subscriptionService: SubscriptionService);
    getSubscriptions(req: any): Promise<{
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
    createSubscription(req: any, dto: CreateSubscriptionDto): Promise<{
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
    cancelSubscription(req: any, id: string): Promise<{
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
}
