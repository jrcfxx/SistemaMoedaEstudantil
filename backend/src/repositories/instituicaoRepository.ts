import { prisma } from '../lib/prisma';
import {
  CreateInstituicaoInput,
  UpdateInstituicaoInput,
} from '../validators/instituicaoValidator';

export const instituicaoRepository = {
  findAll: (search?: string) => {
    return prisma.instituicao.findMany({
      where: search
        ? { nome: { contains: search, mode: 'insensitive' } }
        : undefined,
      orderBy: { nome: 'asc' },
    });
  },

  findById: (id: string) => {
    return prisma.instituicao.findUnique({ where: { id } });
  },

  findByNome: (nome: string) => {
    return prisma.instituicao.findUnique({ where: { nome } });
  },

  create: (data: CreateInstituicaoInput) => {
    return prisma.instituicao.create({ data });
  },

  update: (id: string, data: UpdateInstituicaoInput) => {
    return prisma.instituicao.update({ where: { id }, data });
  },

  delete: (id: string) => {
    return prisma.instituicao.delete({ where: { id } });
  },

  count: () => {
    return prisma.instituicao.count();
  },
};
