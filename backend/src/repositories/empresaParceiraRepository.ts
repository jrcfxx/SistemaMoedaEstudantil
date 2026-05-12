import { prisma } from '../lib/prisma';
import {
  CreateEmpresaParceiraInput,
  UpdateEmpresaParceiraInput,
} from '../validators/empresaParceiraValidator';

export const empresaParceiraRepository = {
  findAll: (search?: string) => {
    return prisma.empresaParceira.findMany({
      where: search
        ? {
            OR: [
              { nome: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { cnpj: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
    });
  },

  findById: (id: string) => {
    return prisma.empresaParceira.findUnique({ where: { id } });
  },

  findByEmail: (email: string) => {
    return prisma.empresaParceira.findUnique({ where: { email } });
  },

  findByCnpj: (cnpj: string) => {
    return prisma.empresaParceira.findUnique({ where: { cnpj } });
  },

  create: (data: CreateEmpresaParceiraInput) => {
    return prisma.empresaParceira.create({ data });
  },

  update: (id: string, data: UpdateEmpresaParceiraInput) => {
    return prisma.empresaParceira.update({ where: { id }, data });
  },

  delete: (id: string) => {
    return prisma.empresaParceira.delete({ where: { id } });
  },

  count: () => {
    return prisma.empresaParceira.count();
  },

  findRecent: (limit = 5) => {
    return prisma.empresaParceira.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  },
};
