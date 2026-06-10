// Database configuration
// Using placeholders for now. You can integrate Prisma, Drizzle, or pg here.

export const dbConfig = {
  url: process.env.DATABASE_URL || 'postgresql://localhost:5432/mydb',
  options: {
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
};
