import { PrismaService } from '../prisma/prisma.service';
export declare class SubscriptionService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handlePaymentSuccess(data: {
        schoolId: string;
        gradeLevel: string;
        billingCycle: 'MONTHLY' | 'TERMLY' | 'ANNUALLY';
        amount: number;
        currency: string;
        gateway: 'PAYSTACK' | 'STRIPE';
        gatewayRef: string;
        customerId?: string;
        subscriptionId?: string;
    }): Promise<void>;
    checkExpiredSubscriptions(): Promise<void>;
}
