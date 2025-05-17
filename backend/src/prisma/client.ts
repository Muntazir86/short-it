import { PrismaClient } from '@prisma/client';
import path from 'path';

// Create a custom Prisma client that knows where to find the schema
const createPrismaClient = () => {
  // In development, the schema is in the project root
  const schemaPath = path.resolve(__dirname, './schema.prisma');
  
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      },
    },
  });
};

// Export a singleton instance of the Prisma client
export const prisma = createPrismaClient();
