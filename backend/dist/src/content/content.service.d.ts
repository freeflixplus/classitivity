import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateLessonDto } from './dto/content.dto';
export declare class ContentService {
    private prisma;
    private storage;
    private readonly logger;
    constructor(prisma: PrismaService, storage: StorageService);
    uploadResource(lessonId: string, file: Express.Multer.File, resourceTypeStr: string, price?: number, currency?: string): Promise<{
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
    createLesson(dto: CreateLessonDto): Promise<{
        subject: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            curriculumVersion: import("@prisma/client").$Enums.CurriculumVersion;
        };
        resources: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        week: number;
        gradeLevel: string;
        term: number;
        title: string;
        description: string | null;
        status: import("@prisma/client").$Enums.ContentStatus;
        subjectId: string;
    }>;
    getLessons(filters: {
        version?: string;
        grade?: string;
        subject?: string;
        term?: number;
        status?: string;
        page: number;
        limit: number;
    }): Promise<{
        data: ({
            subject: {
                name: string;
                code: string;
                curriculumVersion: import("@prisma/client").$Enums.CurriculumVersion;
            };
            resources: {
                id: string;
                type: import("@prisma/client").$Enums.ResourceType;
                fileName: string;
                fileSize: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            week: number;
            gradeLevel: string;
            term: number;
            title: string;
            description: string | null;
            status: import("@prisma/client").$Enums.ContentStatus;
            subjectId: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getLesson(id: string): Promise<{
        subject: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            curriculumVersion: import("@prisma/client").$Enums.CurriculumVersion;
        };
        resources: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        week: number;
        gradeLevel: string;
        term: number;
        title: string;
        description: string | null;
        status: import("@prisma/client").$Enums.ContentStatus;
        subjectId: string;
    }>;
    updateLessonStatus(id: string, status: string): Promise<{
        subject: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            curriculumVersion: import("@prisma/client").$Enums.CurriculumVersion;
        };
        resources: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        week: number;
        gradeLevel: string;
        term: number;
        title: string;
        description: string | null;
        status: import("@prisma/client").$Enums.ContentStatus;
        subjectId: string;
    }>;
    deleteResource(id: string): Promise<{
        message: string;
    }>;
}
