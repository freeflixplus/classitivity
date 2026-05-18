import { ContentService } from './content.service';
import { CreateLessonDto, UpdateLessonStatusDto } from './dto/content.dto';
export declare class ContentController {
    private contentService;
    constructor(contentService: ContentService);
    uploadResource(lessonId: string, file: Express.Multer.File, resourceType: string, price?: string, currency?: string): Promise<{
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
            classId: string | null;
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
        term: number;
        week: number;
        gradeLevel: string;
        title: string;
        description: string | null;
        status: import("@prisma/client").$Enums.ContentStatus;
        subjectId: string;
        topicId: string | null;
    }>;
    getLessons(version?: string, grade?: string, subject?: string, term?: string, status?: string, page?: string, limit?: string): Promise<{
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
    getLesson(id: string): Promise<{
        subject: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            curriculumVersion: import("@prisma/client").$Enums.CurriculumVersion;
            classId: string | null;
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
        term: number;
        week: number;
        gradeLevel: string;
        title: string;
        description: string | null;
        status: import("@prisma/client").$Enums.ContentStatus;
        subjectId: string;
        topicId: string | null;
    }>;
    updateLessonStatus(id: string, dto: UpdateLessonStatusDto): Promise<{
        subject: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            curriculumVersion: import("@prisma/client").$Enums.CurriculumVersion;
            classId: string | null;
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
        term: number;
        week: number;
        gradeLevel: string;
        title: string;
        description: string | null;
        status: import("@prisma/client").$Enums.ContentStatus;
        subjectId: string;
        topicId: string | null;
    }>;
    deleteResource(id: string): Promise<{
        message: string;
    }>;
    getContentTree(version: string): Promise<({
        subjects: ({
            terms: ({
                topics: ({
                    lessons: {
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
                    }[];
                } & {
                    id: string;
                    title: string;
                    weekNumber: number;
                    termId: string;
                    lessonNumber: number;
                })[];
            } & {
                id: string;
                subjectId: string;
                label: string;
                orderIndex: number;
            })[];
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            curriculumVersion: import("@prisma/client").$Enums.CurriculumVersion;
            classId: string | null;
        })[];
    } & {
        id: string;
        curriculumVersion: import("@prisma/client").$Enums.CurriculumVersion;
        gradeLabel: string;
        gradeCode: string;
    })[]>;
    createSchemeOfWork(dto: any): Promise<{
        id: string;
        subjectId: string;
        topicId: string;
        weekNumber: number;
        lessonCount: number;
        termId: string;
    }>;
}
