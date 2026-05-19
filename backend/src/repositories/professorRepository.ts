import { prisma } from '../lib/prisma';
import { CreateProfessorInput, UpdateProfessorInput } from '../validators/professorValidator';

const includeRelations = {
  instituicao: { select: { id: true, nome: true } },
} as const;

export const professorRepository = {
  findAll: (search?: string) => {
    return prisma.professor.findMany({
      where: search
        ? {
            OR: [
              { nome: { contains: search, mode: 'insensitive' } },
              { cpf: { contains: search, mode: 'insensitive' } },
              { departamento: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: includeRelations,
      orderBy: { createdAt: 'desc' },
    });
  },

  findById: (id: string) => {
    return prisma.professor.findUnique({ where: { id }, include: includeRelations });
  },

  findByCpf: (cpf: string) => {
    return prisma.professor.findUnique({ where: { cpf } });
  },

  findTransacoes: (professorId: string) => {
    return prisma.transacaoMoeda.findMany({
      where: { professorId },
      include: { aluno: { select: { id: true, nome: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },

  create: (data: CreateProfessorInput) => {
    return prisma.professor.create({
      data: { ...data, saldoMoedas: 1000 },
      include: includeRelations,
    });
  },

  update: (id: string, data: UpdateProfessorInput) => {
    return prisma.professor.update({ where: { id }, data, include: includeRelations });
  },

  delete: (id: string) => {
    return prisma.professor.delete({ where: { id } });
  },

  count: () => prisma.professor.count(),
};
