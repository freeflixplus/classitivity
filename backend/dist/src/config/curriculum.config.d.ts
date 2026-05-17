export interface CurriculumConfig {
    code: string;
    label: string;
    currency: {
        primary: string;
        alternatives: string[];
    };
    paymentProvider: 'paystack' | 'stripe';
    gradeGroups: {
        label: string;
        grades: {
            code: string;
            label: string;
        }[];
    }[];
    termModel: 'trimester' | 'semester';
    termsPerYear: number;
    examRefs: string[];
}
export declare const NG_CONFIG: CurriculumConfig;
export declare const UK_CONFIG: CurriculumConfig;
export declare const US_CONFIG: CurriculumConfig;
export declare const AU_CONFIG: CurriculumConfig;
export declare const CURRICULUM_CONFIGS: Record<string, CurriculumConfig>;
export declare function getCurriculumConfig(version: string): CurriculumConfig | null;
