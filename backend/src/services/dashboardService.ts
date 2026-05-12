import { alunoRepository } from '../repositories/alunoRepository';
import { empresaParceiraRepository } from '../repositories/empresaParceiraRepository';
import { instituicaoRepository } from '../repositories/instituicaoRepository';

export const dashboardService = {
  getStats: async () => {
    const [totalAlunos, totalEmpresas, totalInstituicoes, recentAlunos, recentEmpresas] =
      await Promise.all([
        alunoRepository.count(),
        empresaParceiraRepository.count(),
        instituicaoRepository.count(),
        alunoRepository.findRecent(5),
        empresaParceiraRepository.findRecent(5),
      ]);

    return {
      totalAlunos,
      totalEmpresas,
      totalInstituicoes,
      recentAlunos,
      recentEmpresas,
    };
  },
};
