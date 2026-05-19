import { prisma } from '../lib/prisma';
import { CreateVantagemInput, UpdateVantagemInput } from '../validators/vantagemValidator';

const includeEmpresa = {
  empresa: { select: { id: true, nome: true, email: true } },
} as const;

export const vantagemRepository = {
  findAll: (search?: string) => {
    return prisma.vantagem.findMany({
      where: search
        ? {
            OR: [
              { titulo: { contains: search, mode: 'insensitive' } },
              { descricao: { contains: search, mode: 'insensitive' } },
              { empresa: { nome: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : undefined,
      include: includeEmpresa,
      orderBy: { createdAt: 'desc' },
    });
  },

  findById: (id: string) => {
    return prisma.vantagem.findUnique({ where: { id }, include: includeEmpresa });
  },

  findByEmpresa: (empresaParceiraId: string) => {
    return prisma.vantagem.findMany({
      where: { empresaParceiraId },
      include: includeEmpresa,
      orderBy: { createdAt: 'desc' },
    });
  },

  create: (data: CreateVantagemInput) => {
    return prisma.vantagem.create({ data, include: includeEmpresa });
  },

  update: (id: string, data: UpdateVantagemInput) => {
    return prisma.vantagem.update({ where: { id }, data, include: includeEmpresa });
  },

  delete: (id: string) => {
    return prisma.vantagem.delete({ where: { id } });
  },
};
