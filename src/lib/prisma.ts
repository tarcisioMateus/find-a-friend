import { env } from '@/env'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'production' ? [] : ['query'],
  datasourceUrl: env.DATABASE_URL,
})
