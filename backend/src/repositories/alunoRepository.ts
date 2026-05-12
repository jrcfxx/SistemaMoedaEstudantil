import { prisma } from '../lib/prisma';
import { CreateAlunoInput, UpdateAlunoInput } from '../validators/alunoValidator';

export const alunoRepository = {
  findAll: (search?: string) => {
    return prisma.aluno.findMany({
      where: search
        ? {
            OR: [
              { nome: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { cpf: { contains: search, mode: 'insensitive' } },
              { curso: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: { instituicao: { select: { id: true, nome: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },

  findById: (id: string) => {
    return prisma.aluno.findUnique({
      where: { id },
      include: { instituicao: { select: { id: true, nome: true } } },
    });
  },

  findByEmail: (email: string) => {
    return prisma.aluno.findUnique({ where: { email } });
  },

  findByCpf: (cpf: string) => {
    return prisma.aluno.findUnique({ where: { cpf } });
  },

  create: (data: CreateAlunoInput) => {
    return prisma.aluno.create({
      data: { ...data, saldoMoedas: 0 },
      include: { instituicao: { select: { id: true, nome: true } } },
    });
  },

  update: (id: string, data: UpdateAlunoInput) => {
    return prisma.aluno.update({
      where: { id },
      data,
      include: { instituicao: { select: { id: true, nome: true } } },
    });
  },

  delete: (id: string) => {
    return prisma.aluno.delete({ where: { id } });
  },

  count: () => {
    return prisma.aluno.count();
  },

  findRecent: (limit = 5) => {
    return prisma.aluno.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { instituicao: { select: { id: true, nome: true } } },
    });
  },
};
