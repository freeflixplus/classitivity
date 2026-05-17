import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CurriculumVersion } from '@prisma/client';
export declare class TeacherService {
    private prisma;
    private storage;
    constructor(prisma: PrismaService, storage: StorageService);
    getDashboard(schoolId: string): Promise<{
        assignedGrades: string[];
        subscriptions: {
            gradeLevel: string;
            status: import("@prisma/client").$Enums.SubscriptionStatus;
            trialEndsAt: Date | null;
            currentPeriodEnd: Date | null;
        }[];
        recentActivity: {
            action: string;
            time: Date;
        }[];
    }>;
    getClassesOverview(schoolId: string, curriculumVersion: CurriculumVersion): Promise<{
        assignedGrades: string[];
        subjects: {
            name: string;
            code: string;
        }[];
    }>;
    getLessons(schoolId: string, curriculumVersion: CurriculumVersion, gradeLevel: string, subjectCode: string): Promise<{
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
    getResourceUrl(resourceId: string, schoolId: string): Promise<{
        url: string;
        type: import("@prisma/client").$Enums.ResourceType;
        fileName: string;
        isDownloadable: boolean;
        isViewOnly: boolean;
    }>;
}
