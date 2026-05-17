/**
 * Seed test data for the Classitivity student workflow.
 * Uses the same Prisma 7 adapter pattern as the NestJS app.
 */
require('dotenv').config();
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set. Aborting.');
  process.exit(1);
}

const adapter = new PrismaPg(databaseUrl);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding test student and course data...');

  // 1. Create a school
  const school = await prisma.school.upsert({
    where: { slug: 'test-academy' },
    update: {},
    create: { name: 'Test Academy', slug: 'test-academy', country: 'Nigeria', curriculumVersion: 'NG' },
  });
  console.log('✓ School:', school.name);

  // 2. Create subject & lesson
  const subject = await prisma.subject.upsert({
    where: { code_curriculumVersion: { code: 'test_sub', curriculumVersion: 'NG' } },
    update: {},
    create: { name: 'Test Subject', code: 'test_sub', curriculumVersion: 'NG' },
  });

  const lesson = await prisma.lesson.upsert({
    where: { subjectId_gradeLevel_term_week: { subjectId: subject.id, gradeLevel: 'JSS1', term: 1, week: 1 } },
    update: { status: 'PUBLISHED', title: 'Introduction to Algebra' },
    create: { title: 'Introduction to Algebra', subjectId: subject.id, gradeLevel: 'JSS1', term: 1, week: 1, status: 'PUBLISHED' },
  });
  console.log('✓ Lesson:', lesson.title);

  // 3. Create Priced Resource (500 NGN = 50000 kobo)
  const resource = await prisma.resource.upsert({
    where: { lessonId_type: { lessonId: lesson.id, type: 'STUDENT_NOTES' } },
    update: { price: 50000, currency: 'NGN' },
    create: {
      lessonId: lesson.id,
      type: 'STUDENT_NOTES',
      fileName: 'algebra_notes.pdf',
      fileSize: 204800,
      mimeType: 'application/pdf',
      r2Key: 'test/algebra_notes.pdf',
      price: 50000,
      currency: 'NGN',
    },
  });
  console.log(`✓ Resource: ${resource.fileName} @ NGN ${resource.price / 100}`);

  // 4. Create Student User
  const hash = await bcrypt.hash('Student2026!', 10);
  const student = await prisma.user.upsert({
    where: { email: 'student@test.com' },
    update: { passwordHash: hash, role: 'STUDENT', schoolId: school.id },
    create: {
      email: 'student@test.com',
      name: 'Test Student',
      passwordHash: hash,
      role: 'STUDENT',
      schoolId: school.id,
    },
  });
  console.log('✓ Student:', student.email);

  // 5. Also make sure the platform admin still exists
  const adminHash = await bcrypt.hash('Dexterity2020?', 10);
  await prisma.user.upsert({
    where: { email: 'admin@classitivity.io' },
    update: { passwordHash: adminHash },
    create: {
      email: 'admin@classitivity.io',
      name: 'Platform Admin',
      passwordHash: adminHash,
      role: 'PLATFORM_ADMIN',
    },
  });
  console.log('✓ Admin: admin@classitivity.io');

  console.log('\n✅ Seeding complete!');
  console.log('   Student login: student@test.com / Student2026!');
  console.log('   Admin login:   admin@classitivity.io / Dexterity2020?');
  console.log(`   Resource ID: ${resource.id} (needed for viewer testing)`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
