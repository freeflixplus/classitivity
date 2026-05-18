import { PrismaService } from '../prisma/prisma.service';
export declare class CurriculumController {
    private prisma;
    constructor(prisma: PrismaService);
    getVersions(): {
        code: string;
        label: string;
        currency: {
            primary: string;
            alternatives: string[];
        };
        termModel: "trimester" | "semester";
        examRefs: string[];
    }[];
    getGrades(version: string): {
        error: string;
        version?: undefined;
        gradeGroups?: undefined;
    } | {
        version: string;
        gradeGroups: {
            label: string;
            grades: {
                code: string;
                label: string;
            }[];
        }[];
        error?: undefined;
    };
    getSubjects(gradeCode: string, version: string): Promise<{
        version: string;
        gradeCode: string;
        subjects: {
            id: string;
            name: string;
            code: string;
        }[];
    }>;
    getTerms(subjectCode: string, version: string, grade: string): Promise<{
        error: string;
        version?: undefined;
        subjectCode?: undefined;
        termModel?: undefined;
        terms?: undefined;
    } | {
        version: string;
        subjectCode: string;
        termModel: "trimester" | "semester";
        terms: {
            number: number;
            label: string;
        }[];
        error?: undefined;
    }>;
    getLessons(termNumber: string, version: string, grade: string, subject: string): Promise<{
        term: number;
        gradeLevel: string;
        subjectCode: string;
        lessons: {
            id: string;
            term: number;
            week: number;
            title: string;
            description: string | null;
            resources: {
                id: string;
                type: import("@prisma/client").$Enums.ResourceType;
            }[];
        }[];
    }>;
}
