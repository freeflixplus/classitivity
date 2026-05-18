import { PrismaService } from '../prisma/prisma.service';
export declare class SchoolAdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboard(schoolId: string): Promise<{
        stats: {
            activeSubscriptions: number;
            totalTeachers: number;
            resourcesAccessed: number;
            nextRenewal: string;
        };
        activeSubscriptions: {
            gradeLevel: string;
            status: import("@prisma/client").$Enums.SubscriptionStatus;
        }[];
        recentActivity: {
            name: string;
            action: string;
            time: Date;
        }[];
    }>;
    getTeachers(schoolId: string): Promise<{
        id: string;
        email: string;
        name: string;
        isActive: boolean;
        lastLoginAt: Date | null;
    }[]>;
    addTeacher(schoolId: string, data: {
        name: string;
        email: string;
    }): Promise<{
        temporaryPassword: string;
        id: string;
        email: string;
        name: string;
    }>;
    getSubscriptions(schoolId: string): Promise<{
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
    getBillingHistory(schoolId: string): Promise<({
        subscription: {
            gradeLevel: string;
            billingCycle: import("@prisma/client").$Enums.BillingCycle;
        };
    } & {
        id: string;
        schoolId: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        currency: string;
        gateway: import("@prisma/client").$Enums.PaymentGateway;
        subscriptionId: string;
        amount: number;
        gatewayRef: string | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        paidAt: Date | null;
    })[]>;
}
