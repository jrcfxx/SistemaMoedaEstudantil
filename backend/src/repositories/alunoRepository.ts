import { prisma } from '../lib/prisma'
import { CreateAlunoInput, UpdateAlunoInput } from '../validators/alunoValidator'

const alunoSelect = {
  id: true,
  nome: true,
  email: true,
  cpf: true,
  rg: true,
  endereco: true,
  curso: true,
  saldoMoedas: true,
  createdAt: true,
  updatedAt: true,
  instituicao: {
    select: { id: true, nome: true },
  },
} as const

export const alunoRepository = {
  findAll() {
    return prisma.aluno.findMany({
      select: alunoSelect,
      orderBy: { nome: 'asc' },
    })
  },

  findById(id: string) {
    return prisma.aluno.findUnique({
      where: { id },
      select: alunoSelect,
    })
  },

  findByEmail(email: string) {
    return prisma.aluno.findUnique({ where: { email } })
  },

  findByCpf(cpf: string) {
    return prisma.aluno.findUnique({ where: { cpf } })
  },

  create(data: CreateAlunoInput) {
    return prisma.aluno.create({
      data,
      select: alunoSelect,
    })
  },

  update(id: string, data: UpdateAlunoInput) {
    return prisma.aluno.update({
      where: { id },
      data,
      select: alunoSelect,
    })
  },

  delete(id: string) {
    return prisma.aluno.delete({ where: { id } })
  },
}
