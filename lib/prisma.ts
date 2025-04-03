import { PrismaClient } from '@prisma/client';

// Declare a global variable to hold the PrismaClient instance
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Instantiate PrismaClient, reusing the instance in development
export const prisma =
  global.prisma ||
  new PrismaClient({
    // Optional: Log Prisma operations
    // log: ['query', 'info', 'warn', 'error'],
  });

// In development, assign the instance to the global variable
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}