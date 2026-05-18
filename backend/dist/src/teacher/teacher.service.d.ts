import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CurriculumVersion } from '@prisma/client';
import { WatermarkService } from '../content/watermark.service';
export declare class TeacherService {
    private prisma;
    private storage;
    private watermarkService;
    constructor(prisma: PrismaService, storage: StorageService, watermarkService: WatermarkService);
    getDashboard(schoolId: string): Promise<{
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
    getResourceUrl(resourceId: string, schoolId: string, userId: string): Promise<{
        url: string;
        type: import("@prisma/client").$Enums.ResourceType;
        fileName: string;
        isDownloadable: boolean;
        isViewOnly: boolean;
    }>;
}
