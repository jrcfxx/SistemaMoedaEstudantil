import { prisma } from '../lib/prisma'
import {
  CreateEmpresaParceiraInput,
  UpdateEmpresaParceiraInput,
} from '../validators/empresaParceiraValidator'

const empresaSelect = {
  id: true,
  nome: true,
  email: true,
  cnpj: true,
  endereco: true,
  telefone: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const

export const empresaParceiraRepository = {
  findAll() {
    return prisma.empresaParceira.findMany({
      select: empresaSelect,
      orderBy: { nome: 'asc' },
    })
  },

  findById(id: string) {
    return prisma.empresaParceira.findUnique({
      where: { id },
      select: empresaSelect,
    })
  },

  findByEmail(email: string) {
    return prisma.empresaParceira.findUnique({ where: { email } })
  },

  findByCnpj(cnpj: string) {
    return prisma.empresaParceira.findUnique({ where: { cnpj } })
  },

  create(data: CreateEmpresaParceiraInput) {
    return prisma.empresaParceira.create({
      data,
      select: empresaSelect,
    })
  },

  update(id: string, data: UpdateEmpresaParceiraInput) {
    return prisma.empresaParceira.update({
      where: { id },
      data,
      select: empresaSelect,
    })
  },

  delete(id: string) {
    return prisma.empresaParceira.delete({ where: { id } })
  },
}
