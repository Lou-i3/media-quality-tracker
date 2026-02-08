/**
 * Database seed script for default data
 * Run with: npx prisma db seed
 */

import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const defaultPlatforms = [
  { name: 'TV', isRequired: true, sortOrder: 1 },
  { name: 'Web Player', isRequired: true, sortOrder: 2 },
  { name: 'Mobile', isRequired: false, sortOrder: 3 },
];

async function main() {
  console.log('Seeding database...');

  // Seed platforms (upsert to avoid duplicates)
  for (const platform of defaultPlatforms) {
    await prisma.platform.upsert({
      where: { name: platform.name },
      update: {}, // Don't update existing platforms
      create: platform,
    });
    console.log(`  Platform: ${platform.name}`);
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
