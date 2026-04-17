import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: any // Use any temporarily to fix IDE sync issues
}

export const prisma = globalForPrisma.prisma ?? (new PrismaClient({
  log: ['query', 'error', 'warn'],
}) as any)

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
