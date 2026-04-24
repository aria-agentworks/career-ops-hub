import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let _db: PrismaClient | null = null;

try {
  _db = globalForPrisma.prisma ?? new PrismaClient({ log: [] });
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = _db;
} catch (e) {
  console.warn('Database not available, running in demo mode');
  _db = null;
}

export const db = _db;
export const isDbAvailable = !!_db;
