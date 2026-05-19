import { prisma } from '../lib/prisma';
import { professorRepository } from '../repositories/professorRepository';
import { alunoRepository } from '../repositories/alunoRepository';
import { instituicaoRepository } from '../repositories/instituicaoRepository';
import { AppError } from '../middlewares/errorHandler';
import { publishEmail } from '../lib/emailQueue';
import {
  CreateProfessorInput,
  UpdateProfessorInput,
  DistribuirMoedasInput,
  createProfessorSchema,
  updateProfessorSchema,
  distribuirMoedasSchema,
} from '../validators/professorValidator';

function normalizeCpf(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

export const professorService = {
  findAll: async (search?: string) => {
    return professorRepository.findAll(search);
  },

  findById: async (id: string) => {
    const professor = await professorRepository.findById(id);
    if (!professor) throw new AppError('Professor não encontrado', 404);
    return professor;
  },

  findTransacoes: async (professorId: string) => {
    const professor = await professorRepository.findById(professorId);
    if (!professor) throw new AppError('Professor não encontrado', 404);
    return professorRepository.findTransacoes(professorId);
  },

  create: async (data: CreateProfessorInput) => {
    const parsed = createProfessorSchema.parse(data);
    parsed.cpf = normalizeCpf(parsed.cpf);

    const instituicao = await instituicaoRepository.findById(parsed.instituicaoId);
    if (!instituicao) throw new AppError('Instituição não encontrada', 404);

    const cpfExistente = await professorRepository.findByCpf(parsed.cpf);
    if (cpfExistente) throw new AppError('CPF já cadastrado', 409);

    return professorRepository.create(parsed);
  },

  update: async (id: string, data: UpdateProfessorInput) => {
    const parsed = updateProfessorSchema.parse(data);

    const professor = await professorRepository.findById(id);
    if (!professor) throw new AppError('Professor não encontrado', 404);

    if (parsed.cpf) {
      parsed.cpf = normalizeCpf(parsed.cpf);
      if (parsed.cpf !== professor.cpf) {
        const cpfExistente = await professorRepository.findByCpf(parsed.cpf);
        if (cpfExistente) throw new AppError('CPF já cadastrado', 409);
      }
    }

    if (parsed.instituicaoId && parsed.instituicaoId !== professor.instituicaoId) {
      const instituicao = await instituicaoRepository.findById(parsed.instituicaoId);
      if (!instituicao) throw new AppError('Instituição não encontrada', 404);
    }

    return professorRepository.update(id, parsed);
  },

  delete: async (id: string) => {
    const professor = await professorRepository.findById(id);
    if (!professor) throw new AppError('Professor não encontrado', 404);
    await professorRepository.delete(id);
  },

  distribuirMoedas: async (professorId: string, data: DistribuirMoedasInput) => {
    const { alunoId, valor, motivo } = distribuirMoedasSchema.parse(data);

    const professor = await professorRepository.findById(professorId);
    if (!professor) throw new AppError('Professor não encontrado', 404);

    if (professor.saldoMoedas < valor) {
      throw new AppError(
        `Saldo insuficiente. Você possui ${professor.saldoMoedas} moeda(s) e tentou distribuir ${valor}.`,
        422,
      );
    }

    const aluno = await alunoRepository.findById(alunoId);
    if (!aluno) throw new AppError('Aluno não encontrado', 404);

    return prisma.$transaction(async (tx) => {
      await tx.professor.update({
        where: { id: professorId },
        data: { saldoMoedas: { decrement: valor } },
      });

      await tx.aluno.update({
        where: { id: alunoId },
        data: { saldoMoedas: { increment: valor } },
      });

      const transacao = await tx.transacaoMoeda.create({
        data: { tipo: 'ENVIO', valor, motivo, alunoId, professorId },
        include: {
          aluno: { select: { id: true, nome: true, email: true } },
          professor: { select: { id: true, nome: true } },
        },
      });

      const result = {
        transacao,
        saldoProfessor: professor.saldoMoedas - valor,
      };

      publishEmail({
        tipo: 'MOEDAS_RECEBIDAS',
        destinatario: aluno.email,
        nomeAluno: aluno.nome,
        nomeProfessor: professor.nome,
        valor,
        motivo,
        saldoAtual: aluno.saldoMoedas + valor,
      });

      return result;
    });
  },
};
