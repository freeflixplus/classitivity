"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const bcrypt = __importStar(require("bcryptjs"));
const adapter = new adapter_pg_1.PrismaPg(process.env.DATABASE_URL);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('🌱 Seeding Classitivity database...\n');
    const adminEmail = 'admin@classitivity.io';
    const adminPassword = 'Dexterity2020?';
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });
    if (existingAdmin) {
        console.log(`✅ Platform admin already exists: ${adminEmail}`);
    }
    else {
        const passwordHash = await bcrypt.hash(adminPassword, 12);
        await prisma.user.create({
            data: {
                email: adminEmail,
                passwordHash,
                name: 'Platform Admin',
                role: client_1.UserRole.PLATFORM_ADMIN,
                isActive: true,
                schoolId: null,
            },
        });
        console.log(`✅ Created platform admin: ${adminEmail}`);
    }
    const ngSubjects = [
        { name: 'Mathematics', code: 'MATH' },
        { name: 'English Language', code: 'ENG' },
        { name: 'Basic Science', code: 'BSCI' },
        { name: 'Basic Technology', code: 'BTECH' },
        { name: 'Social Studies', code: 'SST' },
        { name: 'Civic Education', code: 'CIVIC' },
        { name: 'Computer Studies', code: 'ICT' },
        { name: 'Business Studies', code: 'BIZ' },
        { name: 'Creative Arts', code: 'ART' },
        { name: 'Physical & Health Education', code: 'PHE' },
        { name: 'French', code: 'FRN' },
        { name: 'Agricultural Science', code: 'AGRIC' },
        { name: 'Home Economics', code: 'HECON' },
        { name: 'Religious Studies', code: 'REL' },
    ];
    for (const subj of ngSubjects) {
        await prisma.subject.upsert({
            where: {
                code_curriculumVersion: {
                    code: subj.code,
                    curriculumVersion: 'NG',
                },
            },
            update: {},
            create: {
                name: subj.name,
                code: subj.code,
                curriculumVersion: 'NG',
            },
        });
    }
    console.log(`✅ Seeded ${ngSubjects.length} Nigerian curriculum subjects`);
    const ukSubjects = [
        { name: 'Mathematics', code: 'MATH' },
        { name: 'English', code: 'ENG' },
        { name: 'Science', code: 'SCI' },
        { name: 'History', code: 'HIST' },
        { name: 'Geography', code: 'GEO' },
        { name: 'Computing', code: 'COMP' },
        { name: 'Art & Design', code: 'ART' },
        { name: 'Music', code: 'MUS' },
        { name: 'Physical Education', code: 'PE' },
        { name: 'Design & Technology', code: 'DT' },
        { name: 'Modern Foreign Languages', code: 'MFL' },
        { name: 'Religious Education', code: 'RE' },
    ];
    for (const subj of ukSubjects) {
        await prisma.subject.upsert({
            where: {
                code_curriculumVersion: {
                    code: subj.code,
                    curriculumVersion: 'UK',
                },
            },
            update: {},
            create: {
                name: subj.name,
                code: subj.code,
                curriculumVersion: 'UK',
            },
        });
    }
    console.log(`✅ Seeded ${ukSubjects.length} UK curriculum subjects`);
    console.log('\n🎉 Seeding complete!');
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map