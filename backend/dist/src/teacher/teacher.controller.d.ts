import { TeacherService } from './teacher.service';
export declare class TeacherController {
    private readonly teacherService;
    constructor(teacherService: TeacherService);
    getDashboard(req: any): Promise<{
        assignedGrades: string[];
        subscriptions: {
            trialEndsAt: Date | null;
            gradeLevel: string;
            status: import("@prisma/client").$Enums.SubscriptionStatus;
            currentPeriodEnd: Date | null;
        }[];
        recentActivity: {
            action: string;
            time: Date;
        }[];
    }>;
    getClasses(req: any): Promise<{
        assignedGrades: string[];
        subjects: {
            name: string;
            code: string;
        }[];
    }>;
    getLessons(req: any, grade: string, subject: string): Promise<{
        subject: {
            code: string;
            name: string;
        };
        lessons: {
            id: string;
            term: number;
            week: number;
            title: string;
            resources: {
                id: string;
                type: import("@prisma/client").$Enums.ResourceType;
                title: string;
                fileSize: number;
                mimeType: string;
            }[];
        }[];
    }>;
    getResourceUrl(req: any, id: string): Promise<{
        url: string;
        type: import("@prisma/client").$Enums.ResourceType;
        fileName: string;
        isDownloadable: boolean;
        isViewOnly: boolean;
    }>;
}
