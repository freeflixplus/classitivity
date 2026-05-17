import 'dotenv/config';
import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

// Prisma 7 requires a driver adapter — pass the connection string directly
// SSL is configured via ?sslmode=require in DATABASE_URL
const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding Classitivity database...\n');

  // ─── Platform Admin ───────────────────────────────────────────────
  const adminEmail = 'admin@classitivity.io';
  const adminPassword = 'Dexterity2020?';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`✅ Platform admin already exists: ${adminEmail}`);
  } else {
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: 'Platform Admin',
        role: UserRole.PLATFORM_ADMIN,
        isActive: true,
        schoolId: null,
      },
    });

    console.log(`✅ Created platform admin: ${adminEmail}`);
  }

  // ─── Default Subjects (Nigerian Curriculum) ───────────────────────
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

  // ─── Default Subjects (UK Curriculum) ─────────────────────────────
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
