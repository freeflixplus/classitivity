export type CurriculumCode = "NG" | "UK" | "US" | "AU";

export interface CurriculumConfig {
  code: CurriculumCode;
  label: string;
  shortLabel: string;
  region: string;
  currency: { primary: string; alternatives: string[] };
  paymentProvider: "paystack" | "stripe";
  gradeGroups: { label: string; grades: string[] }[];
  termModel: "trimester" | "semester";
  examRefs: string[];
  flag: string;
}

export const curriculumConfigs: Record<CurriculumCode, CurriculumConfig> = {
  NG: {
    code: "NG",
    label: "Nigerian National Curriculum",
    shortLabel: "Nigeria",
    region: "Nigeria",
    currency: { primary: "NGN", alternatives: ["USD"] },
    paymentProvider: "paystack",
    gradeGroups: [
      { label: "Early Years", grades: ["KG1", "KG2"] },
      { label: "Primary School", grades: ["P1", "P2", "P3", "P4", "P5", "P6"] },
      { label: "Junior Secondary", grades: ["JSS1", "JSS2", "JSS3"] },
      { label: "Senior Secondary", grades: ["SSS1", "SSS2", "SSS3"] },
    ],
    termModel: "trimester",
    examRefs: ["BECE (JSS3)", "WAEC (SSS3)", "NECO (SSS3)"],
    flag: "🇳🇬",
  },
  UK: {
    code: "UK",
    label: "UK National Curriculum",
    shortLabel: "United Kingdom",
    region: "Global UK Schools",
    currency: { primary: "GBP", alternatives: ["EUR", "USD"] },
    paymentProvider: "stripe",
    gradeGroups: [
      { label: "Early Years", grades: ["Nursery", "Reception"] },
      { label: "Key Stage 1", grades: ["Year 1", "Year 2"] },
      { label: "Key Stage 2", grades: ["Year 3", "Year 4", "Year 5", "Year 6"] },
      { label: "Key Stage 3", grades: ["Year 7", "Year 8", "Year 9"] },
      { label: "Key Stage 4", grades: ["Year 10", "Year 11"] },
      { label: "Key Stage 5", grades: ["Year 12", "Year 13"] },
    ],
    termModel: "trimester",
    examRefs: ["SATs (Y6)", "GCSE (Y11)", "A-Level (Y13)"],
    flag: "🇬🇧",
  },
  US: {
    code: "US",
    label: "American Common Core",
    shortLabel: "United States",
    region: "North America",
    currency: { primary: "USD", alternatives: ["CAD"] },
    paymentProvider: "stripe",
    gradeGroups: [
      { label: "Pre-K", grades: ["Pre-K"] },
      { label: "Elementary", grades: ["K", "1st", "2nd", "3rd", "4th", "5th"] },
      { label: "Middle School", grades: ["6th", "7th", "8th"] },
      { label: "High School", grades: ["9th", "10th", "11th", "12th"] },
    ],
    termModel: "semester",
    examRefs: ["SAT", "ACT", "AP Exams"],
    flag: "🇺🇸",
  },
  AU: {
    code: "AU",
    label: "Australian National Curriculum",
    shortLabel: "Australia",
    region: "Australasia",
    currency: { primary: "AUD", alternatives: ["NZD"] },
    paymentProvider: "stripe",
    gradeGroups: [
      { label: "Foundation", grades: ["Pre-School", "Foundation"] },
      { label: "Primary", grades: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6"] },
      { label: "Lower Secondary", grades: ["Year 7", "Year 8", "Year 9", "Year 10"] },
      { label: "Senior Secondary", grades: ["Year 11", "Year 12"] },
    ],
    termModel: "trimester",
    examRefs: ["NAPLAN (Y3,5,7,9)", "VCE/HSC/QCE (Y12)"],
    flag: "🇦🇺",
  },
};

export const allCurriculums = Object.values(curriculumConfigs);
