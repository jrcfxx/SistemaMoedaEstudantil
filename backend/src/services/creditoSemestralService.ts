import { prisma } from '../lib/prisma';
import { getSemestreAtual, MOEDAS_POR_SEMESTRE } from '../lib/semestre';

export const creditoSemestralService = {
  /**
   * Credita 1.000 moedas quando o semestre muda (acumulável).
   * Idempotente por semestre — não credita duas vezes no mesmo período.
   */
  garantirCredito: async (professorId: string): Promise<{ creditado: boolean; valor?: number }> => {
    const semestre = getSemestreAtual();

    return prisma.$transaction(async (tx) => {
      const professor = await tx.professor.findUnique({ where: { id: professorId } });
      if (!professor || professor.ultimoCreditoSemestre === semestre) {
        return { creditado: false };
      }

      await tx.professor.update({
        where: { id: professorId },
        data: {
          saldoMoedas: { increment: MOEDAS_POR_SEMESTRE },
          ultimoCreditoSemestre: semestre,
        },
      });

      return { creditado: true, valor: MOEDAS_POR_SEMESTRE };
    });
  },
};
