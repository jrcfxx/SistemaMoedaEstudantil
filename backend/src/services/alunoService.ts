import { prisma } from '../lib/prisma'
import { AppError } from '../middlewares/AppError'
import { alunoRepository } from '../repositories/alunoRepository'
import { CreateAlunoInput, UpdateAlunoInput } from '../validators/alunoValidator'

export const alunoService = {
  async listarAlunos() {
    return alunoRepository.findAll()
  },

  async buscarAluno(id: string) {
    const aluno = await alunoRepository.findById(id)
    if (!aluno) throw new AppError('Aluno não encontrado', 404)
    return aluno
  },

  async criarAluno(data: CreateAlunoInput) {
    // Verifica se a instituição existe
    const instituicao = await prisma.instituicao.findUnique({
      where: { id: data.instituicaoId },
    })
    if (!instituicao) throw new AppError('Instituição não encontrada', 404)

    // Verifica unicidade do e-mail
    const emailExistente = await alunoRepository.findByEmail(data.email)
    if (emailExistente) throw new AppError('E-mail já cadastrado', 409)

    // Verifica unicidade do CPF
    const cpfExistente = await alunoRepository.findByCpf(data.cpf)
    if (cpfExistente) throw new AppError('CPF já cadastrado', 409)

    return alunoRepository.create(data)
  },

  async atualizarAluno(id: string, data: UpdateAlunoInput) {
    // Verifica se o aluno existe
    await alunoService.buscarAluno(id)

    // Se alterou e-mail, verifica unicidade
    if (data.email) {
      const emailExistente = await alunoRepository.findByEmail(data.email)
      if (emailExistente && emailExistente.id !== id) {
        throw new AppError('E-mail já cadastrado por outro aluno', 409)
      }
    }

    // Se alterou CPF, verifica unicidade
    if (data.cpf) {
      const cpfExistente = await alunoRepository.findByCpf(data.cpf)
      if (cpfExistente && cpfExistente.id !== id) {
        throw new AppError('CPF já cadastrado por outro aluno', 409)
      }
    }

    // Se alterou instituição, verifica se existe
    if (data.instituicaoId) {
      const instituicao = await prisma.instituicao.findUnique({
        where: { id: data.instituicaoId },
      })
      if (!instituicao) throw new AppError('Instituição não encontrada', 404)
    }

    return alunoRepository.update(id, data)
  },

  async removerAluno(id: string) {
    await alunoService.buscarAluno(id)
    await alunoRepository.delete(id)
  },
}
