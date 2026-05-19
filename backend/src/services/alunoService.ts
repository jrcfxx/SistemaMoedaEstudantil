import { alunoRepository } from '../repositories/alunoRepository';
import { instituicaoRepository } from '../repositories/instituicaoRepository';
import { AppError } from '../middlewares/errorHandler';
import {
  CreateAlunoInput,
  UpdateAlunoInput,
  createAlunoSchema,
  updateAlunoSchema,
} from '../validators/alunoValidator';

function normalizeCpf(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

export const alunoService = {
  findAll: async (search?: string) => {
    return alunoRepository.findAll(search);
  },

  findById: async (id: string) => {
    const aluno = await alunoRepository.findById(id);
    if (!aluno) throw new AppError('Aluno não encontrado', 404);
    return aluno;
  },

  findTransacoes: async (id: string) => {
    const aluno = await alunoRepository.findById(id);
    if (!aluno) throw new AppError('Aluno não encontrado', 404);
    return alunoRepository.findTransacoes(id);
  },

  create: async (data: CreateAlunoInput) => {
    const parsed = createAlunoSchema.parse(data);
    parsed.cpf = normalizeCpf(parsed.cpf);

    const instituicao = await instituicaoRepository.findById(parsed.instituicaoId);
    if (!instituicao) throw new AppError('Instituição não encontrada', 404);

    const emailExistente = await alunoRepository.findByEmail(parsed.email);
    if (emailExistente) throw new AppError('E-mail já cadastrado', 409);

    const cpfExistente = await alunoRepository.findByCpf(parsed.cpf);
    if (cpfExistente) throw new AppError('CPF já cadastrado', 409);

    return alunoRepository.create(parsed);
  },

  update: async (id: string, data: UpdateAlunoInput) => {
    const parsed = updateAlunoSchema.parse(data);

    const aluno = await alunoRepository.findById(id);
    if (!aluno) throw new AppError('Aluno não encontrado', 404);

    if (parsed.cpf) {
      parsed.cpf = normalizeCpf(parsed.cpf);
    }

    if (parsed.email && parsed.email !== aluno.email) {
      const emailExistente = await alunoRepository.findByEmail(parsed.email);
      if (emailExistente) throw new AppError('E-mail já cadastrado', 409);
    }

    if (parsed.cpf && parsed.cpf !== aluno.cpf) {
      const cpfExistente = await alunoRepository.findByCpf(parsed.cpf);
      if (cpfExistente) throw new AppError('CPF já cadastrado', 409);
    }

    if (parsed.instituicaoId && parsed.instituicaoId !== aluno.instituicaoId) {
      const instituicao = await instituicaoRepository.findById(parsed.instituicaoId);
      if (!instituicao) throw new AppError('Instituição não encontrada', 404);
    }

    return alunoRepository.update(id, parsed);
  },

  delete: async (id: string) => {
    const aluno = await alunoRepository.findById(id);
    if (!aluno) throw new AppError('Aluno não encontrado', 404);
    await alunoRepository.delete(id);
  },
};
