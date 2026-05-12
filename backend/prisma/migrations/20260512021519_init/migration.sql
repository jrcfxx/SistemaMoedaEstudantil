-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('ALUNO', 'PROFESSOR', 'EMPRESA', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatusEmpresa" AS ENUM ('ATIVA', 'INATIVA');

-- CreateEnum
CREATE TYPE "TipoTransacao" AS ENUM ('ENVIO', 'RECEBIMENTO', 'RESGATE');

-- CreateEnum
CREATE TYPE "StatusResgate" AS ENUM ('PENDENTE', 'UTILIZADO');

-- CreateTable
CREATE TABLE "instituicoes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instituicoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alunos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "saldoMoedas" INTEGER NOT NULL DEFAULT 0,
    "instituicaoId" TEXT NOT NULL,
    "usuarioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alunos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresas_parceiras" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "telefone" TEXT,
    "status" "StatusEmpresa" NOT NULL DEFAULT 'ATIVA',
    "usuarioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresas_parceiras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "tipo" "TipoUsuario" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professores" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "saldoMoedas" INTEGER NOT NULL DEFAULT 1000,
    "instituicaoId" TEXT NOT NULL,
    "usuarioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vantagens" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "custoMoedas" INTEGER NOT NULL,
    "empresaParceiraId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vantagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transacoes_moedas" (
    "id" TEXT NOT NULL,
    "tipo" "TipoTransacao" NOT NULL,
    "valor" INTEGER NOT NULL,
    "motivo" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "professorId" TEXT,
    "vantagemId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transacoes_moedas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resgates" (
    "id" TEXT NOT NULL,
    "codigoCupom" TEXT NOT NULL,
    "status" "StatusResgate" NOT NULL DEFAULT 'PENDENTE',
    "alunoId" TEXT NOT NULL,
    "vantagemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resgates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "instituicoes_nome_key" ON "instituicoes"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_email_key" ON "alunos"("email");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_cpf_key" ON "alunos"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_usuarioId_key" ON "alunos"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_parceiras_email_key" ON "empresas_parceiras"("email");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_parceiras_cnpj_key" ON "empresas_parceiras"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_parceiras_usuarioId_key" ON "empresas_parceiras"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "professores_cpf_key" ON "professores"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "professores_usuarioId_key" ON "professores"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "resgates_codigoCupom_key" ON "resgates"("codigoCupom");

-- AddForeignKey
ALTER TABLE "alunos" ADD CONSTRAINT "alunos_instituicaoId_fkey" FOREIGN KEY ("instituicaoId") REFERENCES "instituicoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alunos" ADD CONSTRAINT "alunos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas_parceiras" ADD CONSTRAINT "empresas_parceiras_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professores" ADD CONSTRAINT "professores_instituicaoId_fkey" FOREIGN KEY ("instituicaoId") REFERENCES "instituicoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professores" ADD CONSTRAINT "professores_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vantagens" ADD CONSTRAINT "vantagens_empresaParceiraId_fkey" FOREIGN KEY ("empresaParceiraId") REFERENCES "empresas_parceiras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacoes_moedas" ADD CONSTRAINT "transacoes_moedas_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacoes_moedas" ADD CONSTRAINT "transacoes_moedas_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "professores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacoes_moedas" ADD CONSTRAINT "transacoes_moedas_vantagemId_fkey" FOREIGN KEY ("vantagemId") REFERENCES "vantagens"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resgates" ADD CONSTRAINT "resgates_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resgates" ADD CONSTRAINT "resgates_vantagemId_fkey" FOREIGN KEY ("vantagemId") REFERENCES "vantagens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
