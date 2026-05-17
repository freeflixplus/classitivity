"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CURRICULUM_CONFIGS = exports.AU_CONFIG = exports.US_CONFIG = exports.UK_CONFIG = exports.NG_CONFIG = void 0;
exports.getCurriculumConfig = getCurriculumConfig;
exports.NG_CONFIG = {
    code: 'NG',
    label: 'Nigerian National Curriculum',
    currency: { primary: 'NGN', alternatives: ['USD'] },
    paymentProvider: 'paystack',
    gradeGroups: [
        {
            label: 'Early Years',
            grades: [
                { code: 'KG1', label: 'Kindergarten 1' },
                { code: 'KG2', label: 'Kindergarten 2' },
            ],
        },
        {
            label: 'Primary School',
            grades: [
                { code: 'P1', label: 'Primary 1' },
                { code: 'P2', label: 'Primary 2' },
                { code: 'P3', label: 'Primary 3' },
                { code: 'P4', label: 'Primary 4' },
                { code: 'P5', label: 'Primary 5' },
                { code: 'P6', label: 'Primary 6' },
            ],
        },
        {
            label: 'Junior Secondary',
            grades: [
                { code: 'JSS1', label: 'JSS 1' },
                { code: 'JSS2', label: 'JSS 2' },
                { code: 'JSS3', label: 'JSS 3' },
            ],
        },
        {
            label: 'Senior Secondary',
            grades: [
                { code: 'SSS1', label: 'SSS 1' },
                { code: 'SSS2', label: 'SSS 2' },
                { code: 'SSS3', label: 'SSS 3' },
            ],
        },
    ],
    termModel: 'trimester',
    termsPerYear: 3,
    examRefs: ['BECE (JSS3)', 'WAEC (SSS3)', 'NECO (SSS3)'],
};
exports.UK_CONFIG = {
    code: 'UK',
    label: 'UK National Curriculum',
    currency: { primary: 'GBP', alternatives: ['EUR', 'USD'] },
    paymentProvider: 'stripe',
    gradeGroups: [
        {
            label: 'Early Years',
            grades: [
                { code: 'NURSERY', label: 'Nursery' },
                { code: 'RECEPTION', label: 'Reception' },
            ],
        },
        {
            label: 'Key Stage 1',
            grades: [
                { code: 'Y1', label: 'Year 1' },
                { code: 'Y2', label: 'Year 2' },
            ],
        },
        {
            label: 'Key Stage 2',
            grades: [
                { code: 'Y3', label: 'Year 3' },
                { code: 'Y4', label: 'Year 4' },
                { code: 'Y5', label: 'Year 5' },
                { code: 'Y6', label: 'Year 6' },
            ],
        },
        {
            label: 'Key Stage 3',
            grades: [
                { code: 'Y7', label: 'Year 7' },
                { code: 'Y8', label: 'Year 8' },
                { code: 'Y9', label: 'Year 9' },
            ],
        },
        {
            label: 'Key Stage 4 (GCSE)',
            grades: [
                { code: 'Y10', label: 'Year 10' },
                { code: 'Y11', label: 'Year 11' },
            ],
        },
        {
            label: 'Key Stage 5 (A-Level)',
            grades: [
                { code: 'Y12', label: 'Year 12' },
                { code: 'Y13', label: 'Year 13' },
            ],
        },
    ],
    termModel: 'trimester',
    termsPerYear: 3,
    examRefs: ['SATs (Y6)', 'GCSE (Y11)', 'A-Level (Y13)'],
};
exports.US_CONFIG = {
    code: 'US',
    label: 'American Common Core',
    currency: { primary: 'USD', alternatives: ['CAD'] },
    paymentProvider: 'stripe',
    gradeGroups: [
        {
            label: 'Pre-School',
            grades: [
                { code: 'PRE-K', label: 'Pre-Kindergarten' },
                { code: 'K', label: 'Kindergarten' },
            ],
        },
        {
            label: 'Elementary School',
            grades: [
                { code: 'G1', label: 'Grade 1' },
                { code: 'G2', label: 'Grade 2' },
                { code: 'G3', label: 'Grade 3' },
                { code: 'G4', label: 'Grade 4' },
                { code: 'G5', label: 'Grade 5' },
            ],
        },
        {
            label: 'Middle School',
            grades: [
                { code: 'G6', label: 'Grade 6' },
                { code: 'G7', label: 'Grade 7' },
                { code: 'G8', label: 'Grade 8' },
            ],
        },
        {
            label: 'High School',
            grades: [
                { code: 'G9', label: 'Grade 9' },
                { code: 'G10', label: 'Grade 10' },
                { code: 'G11', label: 'Grade 11' },
                { code: 'G12', label: 'Grade 12' },
            ],
        },
    ],
    termModel: 'semester',
    termsPerYear: 2,
    examRefs: ['SAT', 'ACT', 'AP Exams'],
};
exports.AU_CONFIG = {
    code: 'AU',
    label: 'Australian National Curriculum',
    currency: { primary: 'AUD', alternatives: ['NZD'] },
    paymentProvider: 'stripe',
    gradeGroups: [
        {
            label: 'Pre-School',
            grades: [
                { code: 'PS', label: 'Pre-School' },
            ],
        },
        {
            label: 'Primary School',
            grades: [
                { code: 'FDN', label: 'Foundation' },
                { code: 'Y1', label: 'Year 1' },
                { code: 'Y2', label: 'Year 2' },
                { code: 'Y3', label: 'Year 3' },
                { code: 'Y4', label: 'Year 4' },
                { code: 'Y5', label: 'Year 5' },
                { code: 'Y6', label: 'Year 6' },
            ],
        },
        {
            label: 'Secondary School',
            grades: [
                { code: 'Y7', label: 'Year 7' },
                { code: 'Y8', label: 'Year 8' },
                { code: 'Y9', label: 'Year 9' },
                { code: 'Y10', label: 'Year 10' },
            ],
        },
        {
            label: 'Senior Secondary',
            grades: [
                { code: 'Y11', label: 'Year 11' },
                { code: 'Y12', label: 'Year 12' },
            ],
        },
    ],
    termModel: 'trimester',
    termsPerYear: 4,
    examRefs: ['NAPLAN (Y3, Y5, Y7, Y9)', 'VCE (Y12)', 'HSC (Y12)'],
};
exports.CURRICULUM_CONFIGS = {
    NG: exports.NG_CONFIG,
    UK: exports.UK_CONFIG,
    US: exports.US_CONFIG,
    AU: exports.AU_CONFIG,
};
function getCurriculumConfig(version) {
    return exports.CURRICULUM_CONFIGS[version.toUpperCase()] || null;
}
//# sourceMappingURL=curriculum.config.js.map