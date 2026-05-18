import { SchoolAdminService } from './school-admin.service';
export declare class SchoolAdminController {
    private readonly schoolAdminService;
    constructor(schoolAdminService: SchoolAdminService);
    getDashboard(req: any): Promise<{
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
    getTeachers(req: any): Promise<{
        id: string;
        email: string;
        name: string;
        isActive: boolean;
        lastLoginAt: Date | null;
    }[]>;
    addTeacher(req: any, data: {
        name: string;
        email: string;
    }): Promise<{
        temporaryPassword: string;
        id: string;
        email: string;
        name: string;
    }>;
    getSubscriptions(req: any): Promise<{
        id: string;
        schoolId: string;
        createdAt: Date;
        updatedAt: Date;
        trialEndsAt: Date | null;
        gradeLevel: string;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        billingCycle: import("@prisma/client").$Enums.BillingCycle;
        currentPeriodStart: Date | null;
        currentPeriodEnd: Date | null;
        gatewayCustomerId: string | null;
        gatewaySubscriptionId: string | null;
        gateway: import("@prisma/client").$Enums.PaymentGateway | null;
    }[]>;
    getBillingHistory(req: any): Promise<({
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
