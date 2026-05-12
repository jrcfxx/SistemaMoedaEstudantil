/*
  Warnings:

  - You are about to drop the `transacoes_moedas` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `nome` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "transacoes_moedas" DROP CONSTRAINT "transacoes_moedas_alunoId_fkey";

-- DropForeignKey
ALTER TABLE "transacoes_moedas" DROP CONSTRAINT "transacoes_moedas_professorId_fkey";

-- DropForeignKey
ALTER TABLE "transacoes_moedas" DROP CONSTRAINT "transacoes_moedas_vantagemId_fkey";

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "nome" TEXT NOT NULL;

-- DropTable
DROP TABLE "transacoes_moedas";

-- CreateTable
CREATE TABLE "transacoes_moeda" (
    "id" TEXT NOT NULL,
    "tipo" "TipoTransacao" NOT NULL,
    "valor" INTEGER NOT NULL,
    "motivo" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "professorId" TEXT,
    "vantagemId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transacoes_moeda_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transacoes_moeda" ADD CONSTRAINT "transacoes_moeda_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacoes_moeda" ADD CONSTRAINT "transacoes_moeda_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "professores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacoes_moeda" ADD CONSTRAINT "transacoes_moeda_vantagemId_fkey" FOREIGN KEY ("vantagemId") REFERENCES "vantagens"("id") ON DELETE SET NULL ON UPDATE CASCADE;
