import { PlatformAdminService } from './platform-admin.service';
export declare class PlatformAdminController {
    private readonly platformAdminService;
    constructor(platformAdminService: PlatformAdminService);
    getDashboard(): Promise<{
        stats: {
            totalSchools: number;
            activeSubscriptions: number;
            totalRevenue: number;
            totalUsers: number;
        };
    }>;
    getSchools(page?: number, limit?: number): Promise<{
        data: ({
            _count: {
                users: number;
                subscriptions: number;
            };
        } & {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            curriculumVersion: import("@prisma/client").$Enums.CurriculumVersion;
            country: string;
            phone: string | null;
            slug: string;
            address: string | null;
            logoUrl: string | null;
            trialEndsAt: Date | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    createSchool(data: {
        name: string;
        curriculumVersion: string;
        country: string;
        adminName: string;
        email: string;
        phone?: string;
    }): Promise<{
        school: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            curriculumVersion: import("@prisma/client").$Enums.CurriculumVersion;
            country: string;
            phone: string | null;
            slug: string;
            address: string | null;
            logoUrl: string | null;
            trialEndsAt: Date | null;
        };
        message: string;
    }>;
    updateSchool(id: string, data: {
        isActive?: boolean;
        name?: string;
    }): Promise<{
        school: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            curriculumVersion: import("@prisma/client").$Enums.CurriculumVersion;
            country: string;
            phone: string | null;
            slug: string;
            address: string | null;
            logoUrl: string | null;
            trialEndsAt: Date | null;
        };
        message: string;
    }>;
    getContentOverview(page?: number, limit?: number): Promise<{
        data: ({
            subject: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                curriculumVersion: import("@prisma/client").$Enums.CurriculumVersion;
                classId: string | null;
            };
            _count: {
                resources: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            term: number;
            week: number;
            gradeLevel: string;
            title: string;
            description: string | null;
            status: import("@prisma/client").$Enums.ContentStatus;
            subjectId: string;
            topicId: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    createCourse(data: {
        title: string;
        subjectCode: string;
        curriculumVersion: string;
        gradeLevel: string;
        term: number;
        week: number;
        description?: string;
        status?: string;
    }): Promise<{
        subject: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            curriculumVersion: import("@prisma/client").$Enums.CurriculumVersion;
            classId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        term: number;
        week: number;
        gradeLevel: string;
        title: string;
        description: string | null;
        status: import("@prisma/client").$Enums.ContentStatus;
        subjectId: string;
        topicId: string | null;
    }>;
    createResource(data: {
        lessonId: string;
        type: string;
        fileName: string;
        fileSize: number;
        mimeType: string;
        price: number;
        currency: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        r2Key: string;
        lessonId: string;
        type: import("@prisma/client").$Enums.ResourceType;
        fileName: string;
        fileSize: number;
        mimeType: string;
        r2Bucket: string;
        price: number;
        currency: string;
    }>;
    getAnalytics(): Promise<{
        monthlyActiveUsers: number;
        resourceViews: number;
        downloads: number;
        avgSession: string;
        topSubjects: {
            name: string;
            views: number;
            pct: number;
        }[];
        resourceTypeBreakdown: {
            type: string;
            count: number;
            pct: number;
        }[];
    }>;
    getPayments(page?: number, limit?: number): Promise<{
        data: ({
            school: {
                name: string;
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
