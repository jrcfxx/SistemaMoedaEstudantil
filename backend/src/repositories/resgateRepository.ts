import { prisma } from '../lib/prisma';

const includeRelations = {
  vantagem: { include: { empresa: { select: { id: true, nome: true } } } },
  aluno: { select: { id: true, nome: true, email: true } },
} as const;

export const resgateRepository = {
  findAll: () => {
    return prisma.resgate.findMany({
      include: includeRelations,
      orderBy: { createdAt: 'desc' },
    });
  },

  findByAluno: (alunoId: string) => {
    return prisma.resgate.findMany({
      where: { alunoId },
      include: includeRelations,
      orderBy: { createdAt: 'desc' },
    });
  },

  findById: (id: string) => {
    return prisma.resgate.findUnique({ where: { id }, include: includeRelations });
  },

  create: (data: { codigoCupom: string; alunoId: string; vantagemId: string }) => {
    return prisma.resgate.create({ data, include: includeRelations });
  },
};
