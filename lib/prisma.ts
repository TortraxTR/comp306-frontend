/*
Server-safe Prisma client wrapper.
- Imports the generated client from `app/generated/prisma` (as configured in prisma/schema.prisma).
- Caches the client on global.__prisma when not in production to avoid multiple instances during HMR.
- This file must only be imported on the server (API routes, server components). Do NOT import into client components.
*/
import { PrismaClient } from 'app/generated/prisma';

// Extend global to include our cached prisma client for dev HMR safety
declare global {
  var __prisma: PrismaClient | undefined;
}

const prismaClient = global.__prisma ?? new PrismaClient({
  // Optional logging for debugging — uncomment during development if needed
  // log: ['query', 'info', 'warn', 'error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prismaClient;
}

export default prismaClient;
