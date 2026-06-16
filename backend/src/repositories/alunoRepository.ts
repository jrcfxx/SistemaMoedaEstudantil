import { prisma } from '../lib/prisma';
import { CreateAlunoInput, UpdateAlunoInput } from '../validators/alunoValidator';
import { Prisma } from '@prisma/client';

function buildWhere(search?: string, instituicaoId?: string): Prisma.AlunoWhereInput | undefined {
  const searchFilter: Prisma.AlunoWhereInput | undefined = search
    ? {
        OR: [
          { nome: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { cpf: { contains: search, mode: 'insensitive' } },
          { curso: { contains: search, mode: 'insensitive' } },
        ],
      }
    : undefined;

  if (instituicaoId && searchFilter) {
    return { AND: [{ instituicaoId }, searchFilter] };
  }
  if (instituicaoId) return { instituicaoId };
  return searchFilter;
}

export const alunoRepository = {
  findAll: (search?: string, instituicaoId?: string) => {
    return prisma.aluno.findMany({
      where: buildWhere(search, instituicaoId),
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

  findTransacoes: (alunoId: string) => {
    return prisma.transacaoMoeda.findMany({
      where: { alunoId },
      include: {
        professor: { select: { id: true, nome: true } },
        vantagem: { select: { id: true, titulo: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
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
