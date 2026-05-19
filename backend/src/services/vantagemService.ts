import { randomBytes } from 'crypto';
import { prisma } from '../lib/prisma';
import { vantagemRepository } from '../repositories/vantagemRepository';
import { resgateRepository } from '../repositories/resgateRepository';
import { alunoRepository } from '../repositories/alunoRepository';
import { empresaParceiraRepository } from '../repositories/empresaParceiraRepository';
import { AppError } from '../middlewares/errorHandler';
import { publishEmail } from '../lib/emailQueue';
import {
  CreateVantagemInput,
  UpdateVantagemInput,
  ResgateInput,
  createVantagemSchema,
  updateVantagemSchema,
  resgateSchema,
} from '../validators/vantagemValidator';

function gerarCodigoCupom(): string {
  const hex = randomBytes(6).toString('hex').toUpperCase();
  return `ME-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`;
}

export const vantagemService = {
  findAlunoByEmail: async (email: string) => {
    const aluno = await prisma.aluno.findUnique({ where: { email } });
    if (!aluno) throw new AppError('Cadastro de aluno não encontrado para este usuário', 404);
    return aluno;
  },

  findAll: async (search?: string) => {
    return vantagemRepository.findAll(search);
  },

  findById: async (id: string) => {
    const vantagem = await vantagemRepository.findById(id);
    if (!vantagem) throw new AppError('Vantagem não encontrada', 404);
    return vantagem;
  },

  findByEmpresa: async (empresaParceiraId: string) => {
    return vantagemRepository.findByEmpresa(empresaParceiraId);
  },

  create: async (data: CreateVantagemInput) => {
    const parsed = createVantagemSchema.parse(data);
    if (parsed.fotoUrl === '') parsed.fotoUrl = undefined;

    const empresa = await empresaParceiraRepository.findById(parsed.empresaParceiraId);
    if (!empresa) throw new AppError('Empresa parceira não encontrada', 404);
    if (empresa.status === 'INATIVA') throw new AppError('Empresa parceira inativa', 422);

    return vantagemRepository.create(parsed);
  },

  update: async (id: string, data: UpdateVantagemInput) => {
    const parsed = updateVantagemSchema.parse(data);
    if (parsed.fotoUrl === '') parsed.fotoUrl = undefined;

    const vantagem = await vantagemRepository.findById(id);
    if (!vantagem) throw new AppError('Vantagem não encontrada', 404);

    return vantagemRepository.update(id, parsed);
  },

  delete: async (id: string) => {
    const vantagem = await vantagemRepository.findById(id);
    if (!vantagem) throw new AppError('Vantagem não encontrada', 404);
    await vantagemRepository.delete(id);
  },

  resgatar: async ({ alunoId, vantagemId }: ResgateInput) => {
    resgateSchema.parse({ alunoId, vantagemId });

    const aluno = await alunoRepository.findById(alunoId);
    if (!aluno) throw new AppError('Aluno não encontrado', 404);

    const vantagem = await vantagemRepository.findById(vantagemId);
    if (!vantagem) throw new AppError('Vantagem não encontrada', 404);

    if (aluno.saldoMoedas < vantagem.custoMoedas) {
      throw new AppError(
        `Saldo insuficiente. Você possui ${aluno.saldoMoedas} moeda(s) e esta vantagem custa ${vantagem.custoMoedas}.`,
        422,
      );
    }

    const codigoCupom = gerarCodigoCupom();

    return prisma.$transaction(async (tx) => {
      await tx.aluno.update({
        where: { id: alunoId },
        data: { saldoMoedas: { decrement: vantagem.custoMoedas } },
      });

      await tx.transacaoMoeda.create({
        data: {
          tipo: 'RESGATE',
          valor: vantagem.custoMoedas,
          motivo: `Resgate da vantagem: ${vantagem.titulo}`,
          alunoId,
          vantagemId,
        },
      });

      const resgate = await tx.resgate.create({
        data: { codigoCupom, alunoId, vantagemId },
        include: {
          vantagem: { include: { empresa: { select: { id: true, nome: true, email: true } } } },
          aluno: { select: { id: true, nome: true, email: true } },
        },
      });

      const saldoRestante = aluno.saldoMoedas - vantagem.custoMoedas;

      publishEmail({
        tipo: 'RESGATE_REALIZADO',
        destinatarioAluno: aluno.email,
        nomeAluno: aluno.nome,
        destinatarioEmpresa: resgate.vantagem.empresa.email,
        nomeEmpresa: resgate.vantagem.empresa.nome,
        tituloVantagem: vantagem.titulo,
        custoMoedas: vantagem.custoMoedas,
        codigoCupom,
        saldoRestante,
      });

      return { resgate, saldoRestante };
    });
  },

  findResgatesByAluno: async (alunoId: string) => {
    const aluno = await alunoRepository.findById(alunoId);
    if (!aluno) throw new AppError('Aluno não encontrado', 404);
    return resgateRepository.findByAluno(alunoId);
  },
};
