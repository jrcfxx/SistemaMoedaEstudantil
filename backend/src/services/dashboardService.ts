import { alunoRepository } from '../repositories/alunoRepository';
import { empresaParceiraRepository } from '../repositories/empresaParceiraRepository';
import { instituicaoRepository } from '../repositories/instituicaoRepository';
import { prisma } from '../lib/prisma';

export const dashboardService = {
  getStats: async () => {
    const [
      totalAlunos,
      totalEmpresas,
      totalInstituicoes,
      totalProfessores,
      totalMoedasDistribuidas,
      recentAlunos,
      recentEmpresas,
    ] = await Promise.all([
      alunoRepository.count(),
      empresaParceiraRepository.count(),
      instituicaoRepository.count(),
      prisma.professor.count(),
      prisma.transacaoMoeda.aggregate({
        _sum: { valor: true },
        where: { tipo: 'ENVIO' },
      }).then((r) => r._sum.valor ?? 0),
      alunoRepository.findRecent(5),
      empresaParceiraRepository.findRecent(5),
    ]);

    return {
      totalAlunos,
      totalEmpresas,
      totalInstituicoes,
      totalProfessores,
      totalMoedasDistribuidas,
      recentAlunos,
      recentEmpresas,
    };
  },
};
