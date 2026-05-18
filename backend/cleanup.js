const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.$executeRawUnsafe(`DELETE FROM "User" WHERE role = 'STUDENT'`);
  console.log("Deleted old students.");
}
main().catch(console.error).finally(() => prisma.$disconnect());
