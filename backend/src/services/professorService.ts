import { prisma } from '../lib/prisma';
import { professorRepository } from '../repositories/professorRepository';
import { alunoRepository } from '../repositories/alunoRepository';
import { instituicaoRepository } from '../repositories/instituicaoRepository';
import { AppError } from '../middlewares/errorHandler';
import { publishEmail } from '../lib/emailQueue';
import { criarUsuario } from '../lib/createUsuario';
import { getSemestreAtual } from '../lib/semestre';
import { creditoSemestralService } from './creditoSemestralService';
import { assertProfessorAutorizado, RequestUser } from '../lib/authHelpers';
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

  assertProfessorAutorizado,
  garantirCreditoSemestral: creditoSemestralService.garantirCredito,

  findTransacoes: async (professorId: string) => {
    const professor = await professorRepository.findById(professorId);
    if (!professor) throw new AppError('Professor não encontrado', 404);
    return professorRepository.findTransacoes(professorId);
  },

  create: async (data: CreateProfessorInput) => {
    const { senha, ...perfil } = createProfessorSchema.parse(data);
    perfil.cpf = normalizeCpf(perfil.cpf);

    const instituicao = await instituicaoRepository.findById(perfil.instituicaoId);
    if (!instituicao) throw new AppError('Instituição não encontrada', 404);

    const cpfExistente = await professorRepository.findByCpf(perfil.cpf);
    if (cpfExistente) throw new AppError('CPF já cadastrado', 409);

    const semestre = getSemestreAtual();

    return prisma.$transaction(async (tx) => {
      const usuario = await criarUsuario(tx, {
        nome: perfil.nome,
        email: perfil.email,
        senha,
        tipo: 'PROFESSOR',
      });

      return tx.professor.create({
        data: {
          nome: perfil.nome,
          cpf: perfil.cpf,
          departamento: perfil.departamento,
          instituicaoId: perfil.instituicaoId,
          saldoMoedas: 1000,
          ultimoCreditoSemestre: semestre,
          usuarioId: usuario.id,
        },
        include: { instituicao: { select: { id: true, nome: true } } },
      });
    });
  },

  update: async (id: string, data: UpdateProfessorInput, usuario?: RequestUser) => {
    await assertProfessorAutorizado(id, usuario);

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
    await creditoSemestralService.garantirCredito(professorId);

    const { alunoId, valor, motivo } = distribuirMoedasSchema.parse(data);

    const professor = await prisma.professor.findUnique({
      where: { id: professorId },
      include: { usuario: { select: { email: true } } },
    });
    if (!professor) throw new AppError('Professor não encontrado', 404);

    const aluno = await alunoRepository.findById(alunoId);
    if (!aluno) throw new AppError('Aluno não encontrado', 404);

    if (aluno.instituicaoId !== professor.instituicaoId) {
      throw new AppError('Aluno e professor devem pertencer à mesma instituição', 422);
    }

    const emailProfessor = professor.usuario?.email;

    const result = await prisma.$transaction(async (tx) => {
      const debito = await tx.professor.updateMany({
        where: { id: professorId, saldoMoedas: { gte: valor } },
        data: { saldoMoedas: { decrement: valor } },
      });
      if (debito.count === 0) {
        throw new AppError(
          `Saldo insuficiente. Você possui ${professor.saldoMoedas} moeda(s) e tentou distribuir ${valor}.`,
          422,
        );
      }

      const alunoAtualizado = await tx.aluno.update({
        where: { id: alunoId },
        data: { saldoMoedas: { increment: valor } },
        select: { saldoMoedas: true },
      });

      const transacao = await tx.transacaoMoeda.create({
        data: { tipo: 'ENVIO', valor, motivo, alunoId, professorId },
        include: {
          aluno: { select: { id: true, nome: true, email: true } },
          professor: { select: { id: true, nome: true } },
        },
      });

      const professorAtualizado = await tx.professor.findUnique({
        where: { id: professorId },
        select: { saldoMoedas: true },
      });

      return {
        transacao,
        saldoProfessor: professorAtualizado!.saldoMoedas,
        saldoAtualAluno: alunoAtualizado.saldoMoedas,
      };
    });

    publishEmail({
      tipo: 'MOEDAS_RECEBIDAS',
      destinatario: aluno.email,
      nomeAluno: aluno.nome,
      nomeProfessor: professor.nome,
      valor,
      motivo,
      saldoAtual: result.saldoAtualAluno,
    });

    if (emailProfessor) {
      publishEmail({
        tipo: 'MOEDAS_ENVIADAS',
        destinatario: emailProfessor,
        nomeProfessor: professor.nome,
        nomeAluno: aluno.nome,
        valor,
        motivo,
        saldoRestante: result.saldoProfessor,
      });
    }

    return result;
  },
};
