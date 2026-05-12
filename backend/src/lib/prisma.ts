import { PrismaClient } from '@prisma/client'

// Singleton: reutiliza a mesma instância do PrismaClient em toda a aplicação.
// Em desenvolvimento, evita criar múltiplas conexões a cada hot-reload do tsx.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
